import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
    },
    windowStart: {
      type: Date,
      required: true,
    },
    windowEnd: {
      type: Date,
      required: true,
    },
    avgLatency: {
      type: Number,
      required: true,
    },
    p95Latency: {
      type: Number,
      required: true,
    },
    requestCount: {
      type: Number,
      required: true,
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

analysisSchema.index({ service: 1, windowEnd: -1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
