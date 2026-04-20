// Dashboard's route file

import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import {
  fetchServiceOverview,
  fetchSystemHealth,
  fetchLatencyChart,
} from './dashboard.controller.js';

const router = express.Router();

router.get('/overview/:service', protect, fetchServiceOverview);
router.get('/system-health', protect, fetchSystemHealth);
router.get('/latency-chart/:service', protect, fetchLatencyChart);

export default router;
