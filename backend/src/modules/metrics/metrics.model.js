import mongoose from 'mongoose';
import retention from '../../config/retention.config.js';

const metricsSchema = new mongoose.Schema(
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
    endpoint: {
      type: String,
      required: true,
    },
    latency: {
      type: Number,
      required: true,
    },
    memory: {
      type: Number,
    },
    cpu: {
      type: Number,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    timestamp: {
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

metricsSchema.index({ user: 1, service: 1, timestamp: -1 });
metricsSchema.index({ user: 1, endpoint: 1 });
metricsSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    name: 'metrics_expiresAt_ttl',
  }
);

const Metric = mongoose.model('Metric', metricsSchema);

export default Metric;
