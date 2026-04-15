import mongoose from 'mongoose';
import retention from '../../config/retention.config.js';

const reportSchema = new mongoose.Schema(
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
    avgLatency: {
      type: Number,
    },
    p95Latency: {
      type: Number,
    },
    baselineAvgLatency: {
      type: Number,
    },
    baselineDeviation: {
      type: Number,
    },
    regressionCount: {
      type: Number,
    },
    cpuCycles: {
      type: Number,
    },
    cacheMisses: {
      type: Number,
    },
    instructions: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

reportSchema.index({ user: 1, service: 1, createdAt: -1 });
reportSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    name: 'report_expiresAt_ttl',
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
