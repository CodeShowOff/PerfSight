import mongoose from 'mongoose';
import env from './env.js';

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (!env.MONGO_URI) {
    throw new Error('MONGO_URI is not set');
  }

  connectionPromise = mongoose
    .connect(env.MONGO_URI)
    .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    })
    .finally(() => {
      connectionPromise = null;
    });

  try {
    return await connectionPromise;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('MongoDB disconnected');
  }
};

export default connectDB;
