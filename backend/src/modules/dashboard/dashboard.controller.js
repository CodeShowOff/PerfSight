import asyncHandler from 'express-async-handler';
import * as dashboardService from './dashboard.service.js';

/**
 * @desc    Fetch comprehensive overview for a service
 * @route   GET /api/dashboard/overview/:service
 * @access  Private
 */
const fetchServiceOverview = asyncHandler(async (req, res) => {
  const { service } = req.params;

  const data = await dashboardService.getServiceOverview(service);

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
  const data = await dashboardService.getSystemHealth();

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

  const validRanges = ['1h', '6h', '24h'];
  if (!validRanges.includes(range)) {
    res.status(400);
    throw new Error('Invalid range. Allowed values: 1h, 6h, 24h');
  }

  const data = await dashboardService.getLatencyChart(service, range);

  res.status(200).json({
    success: true,
    data,
  });
});

export { fetchServiceOverview, fetchSystemHealth, fetchLatencyChart };
