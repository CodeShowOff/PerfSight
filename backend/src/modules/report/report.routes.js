import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import { createReport, fetchReports } from './report.controller.js';

const router = express.Router();

router.post('/:service', protect, createReport);
router.get('/:service', protect, fetchReports);

export default router;
