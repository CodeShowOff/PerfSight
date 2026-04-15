import Baseline from './baseline.model.js';

/**
 * Read baseline for a specific service.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @param {string} service
 * @returns {Promise<Object|null>} Baseline data or null if not found
 */
const getBaseline = async (userId, service) => {
  if (!userId || !service) {
    return null;
  }

  const baseline = await Baseline.findOne({ user: userId, service })
    .select('service avgLatency p95Latency updatedAt')
    .lean();

  return baseline || null;
};

/**
 * Save or update baseline for a service.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @param {string} service
 * @param {Object} data - Must include avgLatency, p95Latency
 * @returns {Promise<Object>} The saved baseline object
 */
const saveBaseline = async (userId, service, data) => {
  const updatedAt = new Date();

  const doc = await Baseline.findOneAndUpdate(
    { user: userId, service },
    {
      $set: {
        avgLatency: data.avgLatency,
        p95Latency: data.p95Latency,
        updatedAt,
      },
      $setOnInsert: {
        user: userId,
        service,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      projection: 'service avgLatency p95Latency updatedAt',
    }
  ).lean();

  return doc;
};

/**
 * List all available baseline services.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @returns {Promise<string[]>} Array of service names
 */
const listBaselines = async (userId) => {
  if (!userId) {
    return [];
  }

  const services = await Baseline.distinct('service', { user: userId });
  return services.sort();
};

export { getBaseline, saveBaseline, listBaselines };
