import asyncHandler from 'express-async-handler';
import * as dashboardService from './dashboard.service.js';

/**
 * @desc    Fetch comprehensive overview for a service
 * @route   GET /api/dashboard/overview/:service
 * @access  Private
 */
const fetchServiceOverview = asyncHandler(async (req, res) => {
  const { service } = req.params;

  const data = await dashboardService.getServiceOverview(req.user._id, service);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Fetch system-wide health for all services
 * @route   GET /api/dashboard/system-health
 * @access  Private
 */
const fetchSystemHealth = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSystemHealth(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Fetch latency chart data for a service
 * @route   GET /api/dashboard/latency-chart/:service
 * @access  Private
 */
const fetchLatencyChart = asyncHandler(async (req, res) => {
  const { service } = req.params;
  const range = req.query.range || '1h';

  const validRanges = ['1h', '6h', '24h', '7d', '30d'];
  if (!validRanges.includes(range)) {
    res.status(400);
    throw new Error('Invalid range. Allowed values: 1h, 6h, 24h, 7d, 30d');
  }

  const data = await dashboardService.getLatencyChart(req.user._id, service, range);

  res.status(200).json({
    success: true,
    data,
  });
});

export { fetchServiceOverview, fetchSystemHealth, fetchLatencyChart };
