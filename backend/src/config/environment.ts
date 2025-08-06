// Environment configuration settings
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  // Node environment (development, production, test)
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Server port - using 4000 to match frontend expectations
  PORT: process.env.PORT || 4000,

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/estospaces',

  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'defaultsecret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // Mock data settings
  USE_MOCK_RESPONSES: process.env.USE_MOCK_RESPONSES === 'true' || process.env.NODE_ENV === 'development',
  
  // Server
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export default config;
