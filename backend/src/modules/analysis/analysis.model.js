import mongoose from 'mongoose';
import retention from '../../config/retention.config.js';

const analysisSchema = new mongoose.Schema(
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

analysisSchema.index({ user: 1, service: 1, windowEnd: -1 });
analysisSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    name: 'analysis_expiresAt_ttl',
  }
);

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
