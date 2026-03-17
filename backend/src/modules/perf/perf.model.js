import mongoose from 'mongoose';

const perfSchema = new mongoose.Schema(
  {
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
      index: true,
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

perfSchema.index({ service: 1, timestamp: -1 });

const Perf = mongoose.model('Perf', perfSchema);

export default Perf;
