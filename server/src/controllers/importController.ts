import { Request, Response } from 'express';
import { fetchAndEnqueueAllFeeds } from '../services/fetchJobs';

export const triggerImport = async (_req: Request, res: Response): Promise<void> => {
  try {
    const summaries = await fetchAndEnqueueAllFeeds();
    res.status(200).json({
      message: 'Feeds enqueued for processing',
      summaries
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to queue imports',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

