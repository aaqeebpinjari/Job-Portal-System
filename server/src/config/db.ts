import mongoose from 'mongoose';
import { env } from './index';
import { logger } from '../utils/logger';

// Data base connection
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to MongoDB');
    throw error;
  }
};

