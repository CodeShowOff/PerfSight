import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Baselines folder at project root
const BASELINES_DIR = path.resolve(__dirname, '../../../baselines');

/**
 * Sanitize service name to prevent path traversal attacks.
 * Only allow alphanumeric, dashes, and underscores.
 *
 * @param {string} service
 * @returns {string}
 * @throws {Error} if service name is invalid
 */
const sanitizeServiceName = (service) => {
  if (!service || typeof service !== 'string') {
    throw new Error('Invalid service name');
  }

  const sanitized = service.replace(/[^a-zA-Z0-9_-]/g, '');

  if (sanitized !== service || sanitized.length === 0) {
    throw new Error('Service name contains invalid characters');
  }

  return sanitized;
};

/**
 * Get full path for a baseline file and ensure it's within baselines directory.
 *
 * @param {string} service
 * @returns {string}
 */
const getBaselinePath = (service) => {
  const sanitized = sanitizeServiceName(service);
  const filePath = path.resolve(BASELINES_DIR, `${sanitized}.json`);

  // Security check: ensure resolved path is still inside baselines directory
  if (!filePath.startsWith(BASELINES_DIR)) {
    throw new Error('Invalid baseline path');
  }

  return filePath;
};

/**
 * Ensure baselines directory exists.
 */
const ensureBaselinesDir = async () => {
  try {
    await fs.mkdir(BASELINES_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
};

/**
 * Read baseline for a specific service.
 *
 * @param {string} service
 * @returns {Promise<Object|null>} Baseline data or null if not found
 */
const getBaseline = async (service) => {
  try {
    const filePath = getBaselinePath(service);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
};

/**
 * Save or update baseline for a service.
 *
 * @param {string} service
 * @param {Object} data - Must include avgLatency, p95Latency
 * @returns {Promise<Object>} The saved baseline object
 */
const saveBaseline = async (service, data) => {
  await ensureBaselinesDir();

  const baseline = {
    service,
    avgLatency: data.avgLatency,
    p95Latency: data.p95Latency,
    updatedAt: new Date().toISOString(),
  };

  const filePath = getBaselinePath(service);
  await fs.writeFile(filePath, JSON.stringify(baseline, null, 2), 'utf-8');

  return baseline;
};

/**
 * List all available baseline services.
 *
 * @returns {Promise<string[]>} Array of service names
 */
const listBaselines = async () => {
  try {
    await ensureBaselinesDir();
    const files = await fs.readdir(BASELINES_DIR);

    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
};

export { getBaseline, saveBaseline, listBaselines };
