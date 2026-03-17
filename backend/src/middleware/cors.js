import cors from 'cors';
import env from '../config/env.js';

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

    if (env.NODE_ENV !== 'production' && origin === 'http://localhost:5173') {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
});

export default corsMiddleware;
