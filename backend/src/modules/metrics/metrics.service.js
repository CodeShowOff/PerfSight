import Metric from './metrics.model.js';

/**
 * Persist a single metric document.
 * @param {Object} data - Validated metric payload.
 * @returns {Promise<Object>} Created metric document.
 */
const createMetric = async (data) => {
  const metric = await Metric.create(data);
  return metric.toObject();
};

/**
 * Retrieve recent metrics with optional filtering.
 * @param {Object} filter - Mongoose query filter.
 * @param {number} limit - Max documents to return (default 50).
 * @returns {Promise<Object[]>} Array of metric documents.
 */
const getRecentMetrics = async (filter = {}, limit = 50) => {
  const metrics = await Metric.find(filter)
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();

  return metrics;
};

/* ─────────────────────────────────────────────
 *  Analytics — Aggregation-based read-only APIs
 * ───────────────────────────────────────────── */

/**
 * Map human-readable interval names to $dateTrunc parameters.
 */
const INTERVAL_MAP = {
  minute: { unit: 'minute', binSize: 1 },
  '5minute': { unit: 'minute', binSize: 5 },
  hour: { unit: 'hour', binSize: 1 },
};

/**
 * Latency timeseries grouped by time bucket.
 * @param {Object} params
 * @param {string} params.service
 * @param {Date}   params.startTime
 * @param {Date}   params.endTime
 * @param {string} [params.interval='minute']
 * @returns {Promise<Array<{time: Date, avgLatency: number}>>}
 */
const getLatencyTimeseries = async ({ service, startTime, endTime, interval = 'minute' }) => {
  const { unit, binSize } = INTERVAL_MAP[interval] || INTERVAL_MAP.minute;

  const pipeline = [
    {
      $match: {
        service,
        timestamp: { $gte: startTime, $lte: endTime },
      },
    },
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: '$timestamp',
            unit,
            binSize,
          },
        },
        avgLatency: { $avg: '$latency' },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        time: '$_id',
        avgLatency: { $round: ['$avgLatency', 2] },
      },
    },
  ];

  return Metric.aggregate(pipeline);
};

/**
 * Per-endpoint performance summary (avgLatency, requestCount, errorRate).
 * @param {Object} params
 * @param {string} params.service
 * @param {Date}   params.startTime
 * @param {Date}   params.endTime
 * @returns {Promise<Array<{endpoint: string, avgLatency: number, requestCount: number, errorRate: number}>>}
 */
const getEndpointPerformanceSummary = async ({ service, startTime, endTime }) => {
  const pipeline = [
    {
      $match: {
        service,
        timestamp: { $gte: startTime, $lte: endTime },
      },
    },
    {
      $group: {
        _id: '$endpoint',
        avgLatency: { $avg: '$latency' },
        requestCount: { $sum: 1 },
        errorCount: {
          $sum: { $cond: [{ $gte: ['$statusCode', 400] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        endpoint: '$_id',
        avgLatency: { $round: ['$avgLatency', 2] },
        requestCount: 1,
        errorRate: {
          $round: [
            { $multiply: [{ $divide: ['$errorCount', '$requestCount'] }, 100] },
            2,
          ],
        },
      },
    },
    { $sort: { requestCount: -1 } },
  ];

  return Metric.aggregate(pipeline);
};

/**
 * System-wide overview (avgLatency, p95Latency, totalRequests).
 * Uses $percentile (MongoDB 7.0+) with a sorted-array fallback.
 * @param {Object} params
 * @param {string} params.service
 * @param {Date}   params.startTime
 * @param {Date}   params.endTime
 * @returns {Promise<{avgLatency: number, p95Latency: number, totalRequests: number}>}
 */
const getSystemOverview = async ({ service, startTime, endTime }) => {
  const matchStage = {
    $match: {
      service,
      timestamp: { $gte: startTime, $lte: endTime },
    },
  };

  /* ── Try $percentile first (MongoDB 7.0+) ── */
  try {
    const pipeline = [
      matchStage,
      {
        $group: {
          _id: null,
          avgLatency: { $avg: '$latency' },
          p95Latency: {
            $percentile: {
              input: '$latency',
              p: [0.95],
              method: 'approximate',
            },
          },
          totalRequests: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          avgLatency: { $round: ['$avgLatency', 2] },
          p95Latency: { $round: [{ $arrayElemAt: ['$p95Latency', 0] }, 2] },
          totalRequests: 1,
        },
      },
    ];

    const [result] = await Metric.aggregate(pipeline);
    if (result) return result;
  } catch {
    /* $percentile not supported — fall through to fallback */
  }

  /* ── Fallback: sorted latencies + $arrayElemAt ── */
  const pipeline = [
    matchStage,
    { $sort: { latency: 1 } },
    {
      $group: {
        _id: null,
        avgLatency: { $avg: '$latency' },
        totalRequests: { $sum: 1 },
        latencies: { $push: '$latency' },
      },
    },
    {
      $project: {
        _id: 0,
        avgLatency: { $round: ['$avgLatency', 2] },
        totalRequests: 1,
        p95Latency: {
          $round: [
            {
              $arrayElemAt: [
                '$latencies',
                { $floor: { $multiply: [0.95, '$totalRequests'] } },
              ],
            },
            2,
          ],
        },
      },
    },
  ];

  const [result] = await Metric.aggregate(pipeline);
  return result || { avgLatency: 0, p95Latency: 0, totalRequests: 0 };
};

export {
  createMetric,
  getRecentMetrics,
  getLatencyTimeseries,
  getEndpointPerformanceSummary,
  getSystemOverview,
};
