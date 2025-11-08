import IORedis, { RedisOptions } from 'ioredis';
import { env } from './index';
import { logger } from '../utils/logger';

// radis connection
const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  username: env.redisUsername,
  password: env.redisPassword
};

export const redisConnection = new IORedis(env.redisUrl, redisOptions);

redisConnection.on('error', (error) => {
  logger.error({ error }, 'Redis connection error');
});

redisConnection.on('connect', () => {
  logger.info('Connected to Redis');
});

export const bullConnection = new IORedis(env.redisUrl, redisOptions);

bullConnection.on('error', (error) => {
  logger.error({ error }, 'BullMQ Redis connection error');
});

bullConnection.on('connect', () => {
  logger.info('BullMQ connection ready');
});

