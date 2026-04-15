import Perf from './perf.model.js';
import retention from '../../config/retention.config.js';

/**
 * Persist a single perf metric document.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - Owner user id.
 * @param {Object} data - Validated perf metric payload
 * @returns {Promise<Object>} Created perf metric document
 */
const createPerfMetric = async (userId, data) => {
  const timestamp = data?.timestamp ? new Date(data.timestamp) : new Date();
  const createdAt = new Date();
  const expiresAt = new Date(
    timestamp.getTime() + retention.dataRetentionSeconds * 1000
  );

  const metric = await Perf.create({
    ...data,
    timestamp,
    createdAt,
    expiresAt,
    user: userId,
  });
  return metric.toObject();
};

/**
 * Fetch perf metrics timeseries for a service within a time range.
 *
 * @param {Object} params
 * @param {string|import('mongoose').Types.ObjectId} params.userId
 * @param {string} params.service
 * @param {Date} params.startTime
 * @param {Date} params.endTime
 * @returns {Promise<Array>} Array of timeseries data points
 */
const getPerfTimeseries = async ({ userId, service, startTime, endTime }) => {
  const metrics = await Perf.find({
    user: userId,
    service,
    timestamp: { $gte: startTime, $lte: endTime },
  })
    .sort({ timestamp: 1 })
    .select('timestamp cpuCycles cacheMisses instructions -_id')
    .lean();

  return metrics.map((m) => ({
    time: m.timestamp,
    cpuCycles: m.cpuCycles,
    cacheMisses: m.cacheMisses,
    instructions: m.instructions,
  }));
};

export { createPerfMetric, getPerfTimeseries };
