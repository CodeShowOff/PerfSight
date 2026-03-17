import Report from './report.model.js';
import Analysis from '../analysis/analysis.model.js';
import Regression from '../regression/regression.model.js';
import Perf from '../perf/perf.model.js';
import { getBaseline } from '../baseline/baseline.service.js';

/**
 * Generate a comprehensive service report by aggregating data from multiple sources.
 *
 * @param {string} service - Service name
 * @returns {Promise<Object>} Report data object
 */
const generateServiceReport = async (service) => {
  // 1. Fetch latest Analysis snapshot
  const latestAnalysis = await Analysis.findOne({ service })
    .sort({ windowEnd: -1 })
    .select('avgLatency p95Latency')
    .lean();

  // 2. Fetch baseline from Git-tracked file
  let baseline = null;
  let baselineAvgLatency = null;
  let baselineDeviation = null;

  try {
    baseline = await getBaseline(service);
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
    service,
    detectedAt: { $gte: oneHourAgo },
  });

  // 4. Fetch latest Perf metrics
  const latestPerf = await Perf.findOne({ service })
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
 * @param {Object} data - Report data object
 * @returns {Promise<Object>} Saved report as plain object
 */
const saveReport = async (data) => {
  const report = await Report.create(data);
  return report.toObject();
};

/**
 * Fetch recent reports for a service.
 *
 * @param {string} service - Service name
 * @param {number} limit - Max number of reports to return (default 10)
 * @returns {Promise<Array>} Array of report documents
 */
const getRecentReports = async (service, limit = 10) => {
  const reports = await Report.find({ service })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return reports;
};

export { generateServiceReport, saveReport, getRecentReports };
