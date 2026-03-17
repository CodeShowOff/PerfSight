import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import corsMiddleware from './middleware/cors.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './modules/users/users.routes.js';
import metricsRoutes from './modules/metrics/metrics.routes.js';
import baselineRoutes from './modules/baseline/baseline.routes.js';
import perfRoutes from './modules/perf/perf.routes.js';
import reportRoutes from './modules/report/report.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Rate limiting on auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/users', authLimiter, userRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/baselines', baselineRoutes);
app.use('/api/perf', perfRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
