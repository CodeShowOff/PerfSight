import Perf from './perf.model.js';

/**
 * Persist a single perf metric document.
 *
 * @param {Object} data - Validated perf metric payload
 * @returns {Promise<Object>} Created perf metric document
 */
const createPerfMetric = async (data) => {
  const metric = await Perf.create(data);
  return metric.toObject();
};

/**
 * Fetch perf metrics timeseries for a service within a time range.
 *
 * @param {Object} params
 * @param {string} params.service
 * @param {Date} params.startTime
 * @param {Date} params.endTime
 * @returns {Promise<Array>} Array of timeseries data points
 */
const getPerfTimeseries = async ({ service, startTime, endTime }) => {
  const metrics = await Perf.find({
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
