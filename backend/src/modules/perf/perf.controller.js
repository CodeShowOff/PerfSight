import asyncHandler from 'express-async-handler';
import * as perfService from './perf.service.js';

/**
 * @desc    Ingest a single perf metric
 * @route   POST /api/perf
 * @access  Private
 */
const ingestPerfMetric = asyncHandler(async (req, res) => {
  const metric = await perfService.createPerfMetric(req.body);

  res.status(201).json({
    success: true,
    data: metric,
  });
});

/**
 * @desc    Fetch perf timeseries for a service
 * @route   GET /api/perf/timeseries
 * @access  Private
 */
const fetchPerfTimeseries = asyncHandler(async (req, res) => {
  const { service, startTime, endTime } = req.query;

  const data = await perfService.getPerfTimeseries({
    service,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  });

  res.status(200).json({
    success: true,
    data,
  });
});

export { ingestPerfMetric, fetchPerfTimeseries };
