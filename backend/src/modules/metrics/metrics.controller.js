import asyncHandler from 'express-async-handler';
import * as metricsService from './metrics.service.js';

/**
 * @desc    Ingest a single metric
 * @route   POST /api/metrics
 * @access  Private
 */
const ingestMetric = asyncHandler(async (req, res) => {
  const metric = await metricsService.createMetric(req.body);

  res.status(201).json({
    success: true,
    data: metric,
  });
});

/**
 * @desc    Fetch recent metrics with optional query filters
 * @route   GET /api/metrics/recent
 * @access  Private
 */
const fetchRecentMetrics = asyncHandler(async (req, res) => {
  const { service, endpoint, limit } = req.query;

  const filter = {};
  if (service) filter.service = String(service);
  if (endpoint) filter.endpoint = String(endpoint);

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 500);

  const metrics = await metricsService.getRecentMetrics(filter, parsedLimit);

  res.status(200).json({
    success: true,
    data: metrics,
  });
});

/* ─────────────────────────────────────────────
 *  Analytics controllers — thin wrappers
 * ───────────────────────────────────────────── */

/**
 * @desc    Latency timeseries for dashboard charts
 * @route   GET /api/metrics/timeseries
 * @access  Private
 */
const fetchLatencyTimeseries = asyncHandler(async (req, res) => {
  const { service, startTime, endTime, interval } = req.query;

  const data = await metricsService.getLatencyTimeseries({
    service,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    interval,
  });

  res.status(200).json({ success: true, data });
});

/**
 * @desc    Per-endpoint performance summary
 * @route   GET /api/metrics/endpoint-summary
 * @access  Private
 */
const fetchEndpointSummary = asyncHandler(async (req, res) => {
  const { service, startTime, endTime } = req.query;

  const data = await metricsService.getEndpointPerformanceSummary({
    service,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  });

  res.status(200).json({ success: true, data });
});

/**
 * @desc    System-wide overview (avg, p95, total)
 * @route   GET /api/metrics/overview
 * @access  Private
 */
const fetchSystemOverview = asyncHandler(async (req, res) => {
  const { service, startTime, endTime } = req.query;

  const data = await metricsService.getSystemOverview({
    service,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  });

  res.status(200).json({ success: true, data });
});

export {
  ingestMetric,
  fetchRecentMetrics,
  fetchLatencyTimeseries,
  fetchEndpointSummary,
  fetchSystemOverview,
};

