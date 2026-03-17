import mongoose from 'mongoose';

const metricsSchema = new mongoose.Schema(
  {
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
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

metricsSchema.index({ service: 1, timestamp: -1 });
metricsSchema.index({ endpoint: 1 });

const Metric = mongoose.model('Metric', metricsSchema);

export default Metric;
