import cron from 'node-cron';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config';
import { redisConnection, bullConnection } from './config/redis';
import { logger } from './utils/logger';
import { fetchAndEnqueueAllFeeds } from './services/fetchJobs';
import './queues/worker';

const start = async () => {
  try {
    await connectDB();
    await Promise.all([redisConnection.ping(), bullConnection.ping()]);
    logger.info('Redis connections verified');

    const server = app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });

    cron.schedule(env.cronSchedule, async () => {
      logger.info({ schedule: env.cronSchedule }, 'Starting scheduled job import');
      await fetchAndEnqueueAllFeeds();
    });

    const shutdown = async () => {
      logger.info('Received shutdown signal, closing gracefully');
      server.close();
      await redisConnection.quit();
      await bullConnection.quit();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

void start();

