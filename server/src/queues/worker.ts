import { Worker } from 'bullmq';
import { bullConnection } from '../config/redis';
import { env } from '../config';
import { logger } from '../utils/logger';
import { JobImportPayload } from '../types/jobs';
import { processJobImport } from '../services/jobProcessor';

export const jobImportWorker = new Worker<JobImportPayload>(
  'jobImportQueue',
  async (job) => {
    const result = await processJobImport(job.data);
    logger.info({ jobId: job.id, ...result }, 'Job import processed');
    return result;
  },
  {
    connection: bullConnection,
    concurrency: env.bullConcurrency
  }
);

jobImportWorker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'Job import failed');
});

jobImportWorker.on('error', (error) => {
  logger.error({ error }, 'Worker encountered an error');
});

