import Report from './report.model.js';
import Analysis from '../analysis/analysis.model.js';
import Regression from '../regression/regression.model.js';
import Perf from '../perf/perf.model.js';
import { getBaseline } from '../baseline/baseline.service.js';
import retention from '../../config/retention.config.js';

/**
 * Generate a comprehensive service report by aggregating data from multiple sources.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - Owner user id.
 * @param {string} service - Service name
 * @returns {Promise<Object>} Report data object
 */
const generateServiceReport = async (userId, service) => {
  // 1. Fetch latest Analysis snapshot
  const latestAnalysis = await Analysis.findOne({ user: userId, service })
    .sort({ windowEnd: -1 })
    .select('avgLatency p95Latency')
    .lean();

  // 2. Fetch baseline from Git-tracked file
  let baseline = null;
  let baselineAvgLatency = null;
  let baselineDeviation = null;

  try {
    baseline = await getBaseline(userId, service);
    if (baseline && baseline.avgLatency) {
      baselineAvgLatency = baseline.avgLatency;
      if (latestAnalysis && baseline.avgLatency > 0) {
        baselineDeviation =
          (latestAnalysis.avgLatency - baseline.avgLatency) /
          baseline.avgLatency;
      }
    }
  } catch {
    // Baseline missing is acceptable
  }

  // 3. Count regression events in the last 1 hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const regressionCount = await Regression.countDocuments({
    user: userId,
    service,
    detectedAt: { $gte: oneHourAgo },
  });

  // 4. Fetch latest Perf metrics
  const latestPerf = await Perf.findOne({ user: userId, service })
    .sort({ timestamp: -1 })
    .select('cpuCycles cacheMisses instructions')
    .lean();

  // Build report object
  const reportData = {
    service,
    avgLatency: latestAnalysis?.avgLatency || null,
    p95Latency: latestAnalysis?.p95Latency || null,
    baselineAvgLatency,
    baselineDeviation,
    regressionCount,
    cpuCycles: latestPerf?.cpuCycles || null,
    cacheMisses: latestPerf?.cacheMisses || null,
    instructions: latestPerf?.instructions || null,
  };

  return reportData;
};

/**
 * Persist a report to the database.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - Owner user id.
 * @param {Object} data - Report data object
 * @returns {Promise<Object>} Saved report as plain object
 */
const saveReport = async (userId, data) => {
  const createdAt = new Date();
  const expiresAt = new Date(
    createdAt.getTime() + retention.dataRetentionSeconds * 1000
  );

  const report = await Report.create({
    ...data,
    user: userId,
    createdAt,
    expiresAt,
  });
  return report.toObject();
};

/**
 * Fetch recent reports for a service.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - Owner user id.
 * @param {string} service - Service name
 * @param {number} limit - Max number of reports to return (default 10)
 * @returns {Promise<Array>} Array of report documents
 */
const getRecentReports = async (userId, service, limit = 10) => {
  const reports = await Report.find({ user: userId, service })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return reports;
};

export { generateServiceReport, saveReport, getRecentReports };
