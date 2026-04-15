import cors from 'cors';
import env from '../config/env.js';

const devAllowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (env.FRONTEND_URL && origin === env.FRONTEND_URL) {
      callback(null, true);
      return;
    }

    if (devAllowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
});

export default corsMiddleware;
