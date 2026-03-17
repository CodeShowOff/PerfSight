import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import {
  validatePerfMetric,
  validatePerfTimeseriesQuery,
} from './perf.validation.js';
import {
  ingestPerfMetric,
  fetchPerfTimeseries,
} from './perf.controller.js';

const router = express.Router();

router.post('/', protect, validatePerfMetric, ingestPerfMetric);
router.get(
  '/timeseries',
  protect,
  validatePerfTimeseriesQuery,
  fetchPerfTimeseries
);

export default router;
