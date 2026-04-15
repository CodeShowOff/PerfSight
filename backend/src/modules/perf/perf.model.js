import mongoose from 'mongoose';
import retention from '../../config/retention.config.js';

const perfSchema = new mongoose.Schema(
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
    cpuCycles: {
      type: Number,
      required: true,
    },
    cacheMisses: {
      type: Number,
      required: true,
    },
    instructions: {
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

perfSchema.index({ user: 1, service: 1, timestamp: -1 });
perfSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    name: 'perf_expiresAt_ttl',
  }
);

const Perf = mongoose.model('Perf', perfSchema);

export default Perf;
