import Analysis from '../analysis/analysis.model.js';
import Regression from '../regression/regression.model.js';
import Perf from '../perf/perf.model.js';
import Report from '../report/report.model.js';
import Metric from '../metrics/metrics.model.js';
import { getBaseline } from '../baseline/baseline.service.js';

/**
 * Get comprehensive overview for a single service.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @param {string} service
 * @returns {Promise<Object>} Service overview with data from all modules
 */
const getServiceOverview = async (userId, service) => {
  // Parallel queries for performance
  const [latestAnalysis, regressions, latestPerf, latestReport] =
    await Promise.all([
      Analysis.findOne({ user: userId, service })
        .sort({ windowEnd: -1 })
        .select('avgLatency p95Latency requestCount')
        .lean(),
      Regression.find({ user: userId, service })
        .sort({ detectedAt: -1 })
        .limit(5)
        .lean(),
      Perf.findOne({ user: userId, service })
        .sort({ timestamp: -1 })
        .select('cpuCycles cacheMisses instructions')
        .lean(),
      Report.findOne({ user: userId, service }).sort({ createdAt: -1 }).lean(),
    ]);

  // Fetch baseline (may fail gracefully)
  let baseline = null;
  try {
    const baselineData = await getBaseline(userId, service);
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
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @returns {Promise<Array>} Array of service health summaries
 */
const getSystemHealth = async (userId) => {
  const services = await Analysis.distinct('service', { user: userId });

  if (services.length === 0) {
    return [];
  }

  const healthPromises = services.map(async (service) => {
    const latestAnalysis = await Analysis.findOne({ user: userId, service })
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
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @param {string} service
 * @param {string} range - "1h", "6h", or "24h"
 * @returns {Promise<Array>} Array of time-series data points
 */
const getLatencyChart = async (userId, service, range) => {
  const rangeMap = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  };

  const duration = rangeMap[range] || rangeMap['1h'];
  const startTime = new Date(Date.now() - duration);

  const bucketByRange = {
    '1h': { unit: 'minute', binSize: 1 },
    '6h': { unit: 'minute', binSize: 5 },
    '24h': { unit: 'minute', binSize: 15 },
    '7d': { unit: 'hour', binSize: 1 },
    '30d': { unit: 'day', binSize: 1 },
  };

  const bucket = bucketByRange[range] || bucketByRange['1h'];

  const matchStage = {
    $match: {
      user: userId,
      service,
      timestamp: { $gte: startTime },
    },
  };

  // Prefer $percentile (MongoDB 7.0+) for p95.
  try {
    const pipeline = [
      matchStage,
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: '$timestamp',
              unit: bucket.unit,
              binSize: bucket.binSize,
            },
          },
          avgLatency: { $avg: '$latency' },
          p95Latency: {
            $percentile: {
              input: '$latency',
              p: [0.95],
              method: 'approximate',
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          windowEnd: '$_id',
          avgLatency: { $round: ['$avgLatency', 2] },
          p95Latency: { $round: [{ $arrayElemAt: ['$p95Latency', 0] }, 2] },
        },
      },
    ];

    const points = await Metric.aggregate(pipeline);
    return points;
  } catch {
    // $percentile not supported — fallback below.
  }

  // Fallback: precompute bucket, sort by bucket+latency, then pick 95th.
  const fallbackPipeline = [
    matchStage,
    {
      $addFields: {
        bucket: {
          $dateTrunc: {
            date: '$timestamp',
            unit: bucket.unit,
            binSize: bucket.binSize,
          },
        },
      },
    },
    { $sort: { bucket: 1, latency: 1 } },
    {
      $group: {
        _id: '$bucket',
        avgLatency: { $avg: '$latency' },
        requestCount: { $sum: 1 },
        latencies: { $push: '$latency' },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        windowEnd: '$_id',
        avgLatency: { $round: ['$avgLatency', 2] },
        p95Latency: {
          $round: [
            {
              $arrayElemAt: [
                '$latencies',
                { $floor: { $multiply: [0.95, '$requestCount'] } },
              ],
            },
            2,
          ],
        },
      },
    },
  ];

  return Metric.aggregate(fallbackPipeline);
};

export { getServiceOverview, getSystemHealth, getLatencyChart };
