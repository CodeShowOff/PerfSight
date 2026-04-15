import asyncHandler from 'express-async-handler';
import * as reportService from './report.service.js';

/**
 * @desc    Generate and save a performance report for a service
 * @route   POST /api/reports/:service
 * @access  Private
 */
const createReport = asyncHandler(async (req, res) => {
  const { service } = req.params;

  const reportData = await reportService.generateServiceReport(req.user._id, service);
  const savedReport = await reportService.saveReport(req.user._id, reportData);

  res.status(201).json({
    success: true,
    data: savedReport,
  });
});

/**
 * @desc    Fetch report history for a service
 * @route   GET /api/reports/:service
 * @access  Private
 */
const fetchReports = asyncHandler(async (req, res) => {
  const { service } = req.params;
  const limit = parseInt(req.query.limit, 10) || 10;

  const reports = await reportService.getRecentReports(req.user._id, service, limit);

  res.status(200).json({
    success: true,
    data: reports,
  });
});

export { createReport, fetchReports };
