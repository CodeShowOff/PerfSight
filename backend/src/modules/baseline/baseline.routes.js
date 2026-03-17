import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import { validateBaseline } from './baseline.validation.js';
import {
  fetchBaseline,
  updateBaseline,
  fetchAllBaselines,
} from './baseline.controller.js';

const router = express.Router();

router.get('/', protect, fetchAllBaselines);
router.get('/:service', protect, fetchBaseline);
router.post('/:service', protect, validateBaseline, updateBaseline);

export default router;
