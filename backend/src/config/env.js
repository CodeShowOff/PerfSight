import dotenv from 'dotenv';

// Prefer local overrides for development without touching production secrets.
//
// Order matters: dotenv does not override existing env vars by default, so
// loading `.env.local` first keeps its values even if `.env` is present.
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const env = {
  PORT: process.env.PORT || '5000',
  MONGO_URI: process.env.MONGO_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || '',
};

export default env;