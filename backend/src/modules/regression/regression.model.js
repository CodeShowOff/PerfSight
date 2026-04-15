import mongoose from 'mongoose';
import retention from '../../config/retention.config.js';

const regressionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    service: {
      type: String,
      required: true,
    },
    detectedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      select: false,
    },
    windowEnd: {
      type: Date,
      required: true,
    },
    metric: {
      type: String,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    baselineMean: {
      type: Number,
      required: true,
    },
    baselineStdDev: {
      type: Number,
      required: true,
    },
    zScore: {
      type: Number,
      required: true,
    },
    baselineAvgLatency: {
      type: Number,
    },
    baselineDeviation: {
      type: Number,
    },
    severity: {
      type: String,
      enum: ['warning', 'critical'],
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

regressionSchema.index({ user: 1, service: 1, detectedAt: -1 });
regressionSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    name: 'regression_expiresAt_ttl',
  }
);

const Regression = mongoose.model('Regression', regressionSchema);

export default Regression;
