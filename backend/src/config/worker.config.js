import env from './env.js';

const workerConfig = {
  WORKER_INTERVAL_MS: Number(process.env.WORKER_INTERVAL_MS || 60000),
  NODE_ENV: env.NODE_ENV,
};

export default workerConfig;
