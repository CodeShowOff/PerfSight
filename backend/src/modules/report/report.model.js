import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

reportSchema.index({ service: 1, createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
