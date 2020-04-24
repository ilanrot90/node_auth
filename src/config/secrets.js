const logger = require('../utils/logger.utils');
const fs = require('fs');

const ENVIRONMENT = process.env.NODE_ENV;
const isProd = ENVIRONMENT !== 'development'; // Anything else is treated as 'dev'
const envPath = isProd ? 'src/config/prod.config.env' : 'src/config/dev.config.env';

if (fs.existsSync(envPath)) {
  logger.debug('Using .env file to supply config environment variables');
  // set dotenv config
  require('dotenv').config({
    path: envPath,
  });
}

// mongo secrets
const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

if (!SESSION_SECRET) {
  logger.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}

if (!MONGODB_URI) {
  if (isProd) {
    logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
  } else {
    logger.debug('No mongo connection string. Set MONGODB_URI_LOCAL environment variable.');
  }
  process.exit(1);
}

const jwtKey = process.env.JWT_KEY;
const jwtExpire = process.env.JWT_EXPIRE;
const cookieExpire = process.env.COOKIE_EXPIRE;
const mailConfig = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER_NAME: process.env.SMTP_USER_NAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
};

module.exports = {
  isProd,
  ENVIRONMENT,
  SESSION_SECRET,
  MONGODB_URI,
  jwtExpire,
  cookieExpire,
  jwtKey,
  mailConfig,
};
