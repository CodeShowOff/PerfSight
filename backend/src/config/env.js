import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: process.env.PORT || '5000',
  MONGO_URI: process.env.MONGO_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || '',
};

export default env;
