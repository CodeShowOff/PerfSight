import Analysis from '../analysis/analysis.model.js';
import Regression from '../regression/regression.model.js';
import Perf from '../perf/perf.model.js';
import Report from '../report/report.model.js';
import { getBaseline } from '../baseline/baseline.service.js';

/**
 * Get comprehensive overview for a single service.
 *
 * @param {string} service
 * @returns {Promise<Object>} Service overview with data from all modules
 */
const getServiceOverview = async (service) => {
  // Parallel queries for performance
  const [latestAnalysis, regressions, latestPerf, latestReport] =
    await Promise.all([
      Analysis.findOne({ service })
        .sort({ windowEnd: -1 })
        .select('avgLatency p95Latency requestCount')
        .lean(),
      Regression.find({ service })
        .sort({ detectedAt: -1 })
        .limit(5)
        .lean(),
      Perf.findOne({ service })
        .sort({ timestamp: -1 })
        .select('cpuCycles cacheMisses instructions')
        .lean(),
      Report.findOne({ service }).sort({ createdAt: -1 }).lean(),
    ]);

  // Fetch baseline (may fail gracefully)
  let baseline = null;
  try {
    const baselineData = await getBaseline(service);
    if (baselineData && baselineData.avgLatency) {
      baseline = { avgLatency: baselineData.avgLatency };
    }
  } catch {
    // Baseline missing is acceptable
  }

  return {
    service,
    analysis: latestAnalysis
      ? {
          avgLatency: latestAnalysis.avgLatency,
          p95Latency: latestAnalysis.p95Latency,
          requestCount: latestAnalysis.requestCount,
        }
      : null,
    baseline,
    regressions: regressions || [],
    perf: latestPerf
      ? {
          cpuCycles: latestPerf.cpuCycles,
          cacheMisses: latestPerf.cacheMisses,
          instructions: latestPerf.instructions,
        }
      : null,
    report: latestReport || null,
  };
};

/**
 * Get system-wide health overview for all services.
 *
 * @returns {Promise<Array>} Array of service health summaries
 */
const getSystemHealth = async () => {
  const services = await Analysis.distinct('service');

  if (services.length === 0) {
    return [];
  }

  const healthPromises = services.map(async (service) => {
    const latestAnalysis = await Analysis.findOne({ service })
      .sort({ windowEnd: -1 })
      .select('avgLatency p95Latency')
      .lean();

    return {
      service,
      avgLatency: latestAnalysis?.avgLatency || null,
      p95Latency: latestAnalysis?.p95Latency || null,
    };
  });

  return Promise.all(healthPromises);
};

/**
 * Get latency chart data for a service over a time range.
 *
 * @param {string} service
 * @param {string} range - "1h", "6h", or "24h"
 * @returns {Promise<Array>} Array of time-series data points
 */
const getLatencyChart = async (service, range) => {
  const rangeMap = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
  };

  const duration = rangeMap[range] || rangeMap['1h'];
  const startTime = new Date(Date.now() - duration);

  const snapshots = await Analysis.find({
    service,
    windowEnd: { $gte: startTime },
  })
    .sort({ windowEnd: 1 })
    .select('windowEnd avgLatency p95Latency')
    .lean();

  return snapshots.map((s) => ({
    time: s.windowEnd,
    avgLatency: s.avgLatency,
    p95Latency: s.p95Latency,
  }));
};

export { getServiceOverview, getSystemHealth, getLatencyChart };
