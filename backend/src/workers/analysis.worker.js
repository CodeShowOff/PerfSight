/**
 * Background Analysis Worker
 *
 * Standalone process — does NOT import Express.
 * Connects to MongoDB independently and computes rolling
 * analysis snapshots every 60 seconds for each distinct service.
 *
 * Run:  node src/workers/analysis.worker.js
 */

import connectDB, { disconnectDB } from '../config/db.js';
import env from '../config/env.js';
import workerConfig from '../config/worker.config.js';
import Metric from '../modules/metrics/metrics.model.js';
import {
  computeWindowAnalysis,
  saveAnalysisSnapshot,
} from '../modules/analysis/analysis.service.js';
import {
  detectRegression,
  saveRegressionEvent,
} from '../modules/regression/regression.service.js';
import {
  generateServiceReport,
  saveReport,
} from '../modules/report/report.service.js';

const INTERVAL_MS = workerConfig.WORKER_INTERVAL_MS;
let intervalId;
let isShuttingDown = false;

/**
 * Single tick: find every distinct service, compute a 1-minute window
 * snapshot, and persist it.
 */
const runAnalysisCycle = async () => {
  try {
    const pairs = await Metric.aggregate([
      { $match: { user: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: {
            user: '$user',
            service: '$service',
          },
        },
      },
    ]);

    if (pairs.length === 0) {
      console.log('[Worker] No user/service pairs found — skipping cycle.');
      return;
    }

    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - INTERVAL_MS);

    for (const pair of pairs) {
      const userId = pair?._id?.user;
      const service = pair?._id?.service;

      if (!userId || !service) {
        continue;
      }

      try {
        const result = await computeWindowAnalysis({ userId, service, startTime, endTime });

        if (!result) {
          console.log(`[Worker] No metrics for "${service}" in window — skipped.`);
          continue;
        }

        const snapshot = await saveAnalysisSnapshot({
          user: userId,
          service,
          windowStart: startTime,
          windowEnd: endTime,
          avgLatency: result.avgLatency,
          p95Latency: result.p95Latency,
          requestCount: result.requestCount,
        });

        console.log(
          `[Worker] Snapshot saved — service="${service}" | requests=${result.requestCount} | avgLatency=${result.avgLatency}ms | p95=${result.p95Latency}ms`
        );

        // Regression detection
        try {
          const regression = await detectRegression({
            userId,
            service,
            latestAnalysis: snapshot,
          });

          if (regression) {
            await saveRegressionEvent(userId, regression);

            const baselineInfo = regression.baselineAvgLatency
              ? ` | baseline=${regression.baselineAvgLatency.toFixed(2)}ms (${(regression.baselineDeviation * 100).toFixed(1)}% deviation)`
              : '';

            console.log(
              `[Worker] 🚨 REGRESSION DETECTED — service="${service}" | severity=${regression.severity} | z-score=${regression.zScore.toFixed(2)} | current=${regression.currentValue}ms vs statistical=${regression.baselineMean.toFixed(2)}ms${baselineInfo}`
            );
          }
        } catch (regErr) {
          console.error(
            `[Worker] Regression detection failed for "${service}":`,
            regErr.message
          );
        }

        // Report generation
        try {
          const report = await generateServiceReport(userId, service);

          if (report) {
            await saveReport(userId, report);
            console.log(`[Worker] Report generated for "${service}"`);
          }
        } catch (reportErr) {
          console.error(
            `[Worker] Report generation failed for "${service}":`,
            reportErr.message
          );
        }
      } catch (err) {
        console.error(`[Worker] Error processing service "${service}":`, err.message);
      }
    }
  } catch (cycleErr) {
    console.error('[Worker] Analysis cycle failed:', cycleErr.message);
  }
};

/**
 * Boot: connect to DB, run first cycle immediately, then repeat on interval.
 */
const start = async () => {
  if (!env.MONGO_URI) {
    throw new Error('MONGO_URI is not set');
  }

  await connectDB();
  console.log('Analysis Worker Started');
  if (workerConfig.NODE_ENV === 'production') {
    console.log('Worker running in production mode');
  }

  // Run immediately on startup, then every INTERVAL_MS
  await runAnalysisCycle();
  intervalId = setInterval(async () => {
    try {
      await runAnalysisCycle();
    } catch (error) {
      console.error('[Worker] Unexpected cycle execution error:', error.message);
    }
  }, INTERVAL_MS);
};

const shutdown = async (signal, exitCode = 0) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`[Worker] Received ${signal}. Starting graceful shutdown...`);

  const forceExitTimer = setTimeout(() => {
    console.error('[Worker] Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);

  forceExitTimer.unref();

  try {
    if (intervalId) {
      clearInterval(intervalId);
    }

    await disconnectDB();
  } catch (error) {
    console.error(`[Worker] Shutdown error: ${error.message}`);
    process.exit(1);
  }

  process.exit(exitCode);
};

process.on('unhandledRejection', (reason) => {
  console.error('[Worker] Unhandled Rejection:', reason);
  shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
  console.error('[Worker] Uncaught Exception:', error);
  shutdown('uncaughtException', 1);
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

start().catch((err) => {
  console.error('[Worker] Fatal error:', err.message);
  process.exit(1);
});


//workers.js


