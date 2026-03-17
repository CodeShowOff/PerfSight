import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import { validateMetric, validateAnalyticsQuery } from './metrics.validation.js';
import {
  ingestMetric,
  fetchRecentMetrics,
  fetchLatencyTimeseries,
  fetchEndpointSummary,
  fetchSystemOverview,
} from './metrics.controller.js';

const router = express.Router();

/* ── Ingestion ── */
router.post('/', protect, validateMetric, ingestMetric);
router.get('/recent', protect, fetchRecentMetrics);

/* ── Analytics ── */
router.get('/timeseries', protect, validateAnalyticsQuery, fetchLatencyTimeseries);
router.get('/endpoint-summary', protect, validateAnalyticsQuery, fetchEndpointSummary);
router.get('/overview', protect, validateAnalyticsQuery, fetchSystemOverview);

export default router;

