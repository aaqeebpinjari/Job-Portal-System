import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? '5000',
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  redisUsername: process.env.REDIS_USERNAME,
  redisPassword: process.env.REDIS_PASSWORD,
  bullConcurrency: Number(process.env.BULL_CONCURRENCY ?? '5'),
  cronSchedule: process.env.CRON_SCHEDULE ?? '0 * * * *'
};

if (!env.mongoUri) {
  throw new Error('MONGO_URI environment variable is required');
}

if (!env.redisUrl) {
  throw new Error('REDIS_URL environment variable is required');
}

