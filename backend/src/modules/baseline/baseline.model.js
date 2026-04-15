import mongoose from 'mongoose';

const baselineSchema = new mongoose.Schema(
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
      index: true,
    },
    avgLatency: {
      type: Number,
      required: true,
      min: 0,
    },
    p95Latency: {
      type: Number,
      required: true,
      min: 0,
    },
    updatedAt: {
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

baselineSchema.index({ user: 1, service: 1 }, { unique: true });

const Baseline = mongoose.model('Baseline', baselineSchema);

export default Baseline;
