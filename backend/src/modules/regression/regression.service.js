import Analysis from '../analysis/analysis.model.js';
import Regression from './regression.model.js';
import { getBaseline } from '../baseline/baseline.service.js';
import retention from '../../config/retention.config.js';

/**
 * Calculate baseline statistics from historical Analysis snapshots.
 * Fetches last 30 snapshots BEFORE the current window.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @param {string} service
 * @param {Date} beforeWindowEnd - Exclude snapshots after this timestamp
 * @returns {Promise<{mean: number, stdDev: number}|null>}
 */
const calculateBaselineStats = async (userId, service, beforeWindowEnd) => {
  const snapshots = await Analysis.find({
    user: userId,
    service,
    windowEnd: { $lt: beforeWindowEnd },
  })
    .sort({ windowEnd: -1 })
    .limit(30)
    .select('avgLatency')
    .lean();

  if (snapshots.length < 10) {
    return null;
  }

  const latencies = snapshots.map((s) => s.avgLatency);
  const n = latencies.length;

  const mean = latencies.reduce((sum, val) => sum + val, 0) / n;

  const variance =
    latencies.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;

  const stdDev = Math.sqrt(variance);

  return { mean, stdDev };
};

/**
 * Get baseline comparison from Git-tracked baseline file.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @param {string} service
 * @param {Object} latestAnalysis - Must have { avgLatency }
 * @returns {Promise<{baselineAvgLatency: number, baselineDeviation: number}|null>}
 */
const getBaselineComparison = async (userId, service, latestAnalysis) => {
  try {
    const baseline = await getBaseline(userId, service);

    if (!baseline || !baseline.avgLatency) {
      return null;
    }

    if (baseline.avgLatency === 0) {
      return null;
    }

    const baselineDeviation =
      (latestAnalysis.avgLatency - baseline.avgLatency) / baseline.avgLatency;

    return {
      baselineAvgLatency: baseline.avgLatency,
      baselineDeviation,
    };
  } catch {
    return null;
  }
};

/**
 * Detect regression using HYBRID detection: statistical z-score + baseline deviation.
 *
 * @param {Object} params
 * @param {string|import('mongoose').Types.ObjectId} params.userId
 * @param {string} params.service
 * @param {Object} params.latestAnalysis - Must have { avgLatency, windowEnd }
 * @returns {Promise<Object|null>} Regression object or null if normal
 */
const detectRegression = async ({ userId, service, latestAnalysis }) => {
  const baseline = await calculateBaselineStats(userId, service, latestAnalysis.windowEnd);

  if (!baseline) {
    return null;
  }

  const { mean, stdDev } = baseline;

  if (stdDev === 0) {
    return null;
  }

  const currentValue = latestAnalysis.avgLatency;
  const zScore = (currentValue - mean) / stdDev;

  let severity = null;

  if (zScore >= 3) {
    severity = 'critical';
  } else if (zScore >= 2) {
    severity = 'warning';
  }

  // Get baseline comparison from Git-tracked baseline file
  const baselineComparison = await getBaselineComparison(
    userId,
    service,
    latestAnalysis
  );

  // Hybrid detection: if baseline deviation >= 20%, increase severity
  if (baselineComparison && baselineComparison.baselineDeviation >= 0.20) {
    if (severity === 'warning') {
      severity = 'critical';
    } else if (!severity) {
      severity = 'warning';
    }
  }

  if (!severity) {
    return null;
  }

  const regressionData = {
    service,
    windowEnd: latestAnalysis.windowEnd,
    metric: 'avgLatency',
    currentValue,
    baselineMean: mean,
    baselineStdDev: stdDev,
    zScore,
    severity,
  };

  // Add baseline data if available
  if (baselineComparison) {
    regressionData.baselineAvgLatency = baselineComparison.baselineAvgLatency;
    regressionData.baselineDeviation = baselineComparison.baselineDeviation;
  }

  return regressionData;
};

/**
 * Persist a regression event to the database.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - Owner user id.
 * @param {Object} data - Regression event object
 * @returns {Promise<Object>} Saved document as plain object
 */
const saveRegressionEvent = async (userId, data) => {
  const detectedAt = new Date();
  const expiresAt = new Date(
    detectedAt.getTime() + retention.dataRetentionSeconds * 1000
  );

  const doc = await Regression.create({
    ...data,
    user: userId,
    detectedAt,
    expiresAt,
  });
  return doc.toObject();
};

export { calculateBaselineStats, getBaselineComparison, detectRegression, saveRegressionEvent };
