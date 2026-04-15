import asyncHandler from 'express-async-handler';
import * as baselineService from './baseline.service.js';

/**
 * @desc    Fetch baseline for a specific service
 * @route   GET /api/baselines/:service
 * @access  Private
 */
const fetchBaseline = asyncHandler(async (req, res) => {
  const { service } = req.params;

  const baseline = await baselineService.getBaseline(req.user._id, service);

  if (!baseline) {
    res.status(404);
    throw new Error(`Baseline not found for service: ${service}`);
  }

  res.status(200).json({
    success: true,
    data: baseline,
  });
});

/**
 * @desc    Update or create baseline for a specific service
 * @route   POST /api/baselines/:service
 * @access  Private
 */
const updateBaseline = asyncHandler(async (req, res) => {
  const { service } = req.params;
  const { avgLatency, p95Latency } = req.body;

  const baseline = await baselineService.saveBaseline(req.user._id, service, {
    avgLatency,
    p95Latency,
  });

  res.status(200).json({
    success: true,
    data: baseline,
  });
});

/**
 * @desc    List all baseline services
 * @route   GET /api/baselines
 * @access  Private
 */
const fetchAllBaselines = asyncHandler(async (req, res) => {
  const services = await baselineService.listBaselines(req.user._id);

  res.status(200).json({
    success: true,
    data: services,
  });
});

export { fetchBaseline, updateBaseline, fetchAllBaselines };
