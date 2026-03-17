import mongoose from 'mongoose';

const regressionSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
    },
    detectedAt: {
      type: Date,
      default: Date.now,
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

regressionSchema.index({ service: 1, detectedAt: -1 });

const Regression = mongoose.model('Regression', regressionSchema);

export default Regression;
