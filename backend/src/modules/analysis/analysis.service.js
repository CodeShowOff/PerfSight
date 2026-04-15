import Metric from '../metrics/metrics.model.js';
import Analysis from './analysis.model.js';
import retention from '../../config/retention.config.js';

/**
 * Compute a rolling analysis snapshot for a single service within a time window.
 * Uses MongoDB aggregation only — never loads raw documents into memory.
 *
 * @param {Object}  params
 * @param {string|import('mongoose').Types.ObjectId}  params.userId
 * @param {string}  params.service
 * @param {Date}    params.startTime
 * @param {Date}    params.endTime
 * @returns {Promise<{avgLatency:number, p95Latency:number, requestCount:number}|null>}
 */
const computeWindowAnalysis = async ({ userId, service, startTime, endTime }) => {
  const matchStage = {
    $match: {
      user: userId,
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
          requestCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          avgLatency: { $round: ['$avgLatency', 2] },
          p95Latency: { $round: [{ $arrayElemAt: ['$p95Latency', 0] }, 2] },
          requestCount: 1,
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
        requestCount: { $sum: 1 },
        latencies: { $push: '$latency' },
      },
    },
    {
      $project: {
        _id: 0,
        avgLatency: { $round: ['$avgLatency', 2] },
        requestCount: 1,
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

  const [result] = await Metric.aggregate(pipeline);
  return result || null;
};

/**
 * Persist a computed analysis snapshot.
 *
 * @param {Object} data - Must include user, service, windowStart, windowEnd, avgLatency, p95Latency, requestCount.
 * @returns {Promise<Object>} The saved document as a plain JS object.
 */
const saveAnalysisSnapshot = async (data) => {
  const windowEnd = data?.windowEnd ? new Date(data.windowEnd) : new Date();
  const expiresAt = new Date(
    windowEnd.getTime() + retention.dataRetentionSeconds * 1000
  );

  const doc = await Analysis.create({
    ...data,
    expiresAt,
  });
  return doc.toObject();
};

export { computeWindowAnalysis, saveAnalysisSnapshot };
