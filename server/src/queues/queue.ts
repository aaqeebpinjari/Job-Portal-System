import { Queue } from 'bullmq';
import { bullConnection } from '../config/redis';
import { JobImportPayload } from '../types/jobs';

export const jobImportQueue = new Queue<JobImportPayload>('jobImportQueue', {
  connection: bullConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

export const addJobToQueue = async (payload: JobImportPayload): Promise<void> => {
  await jobImportQueue.add('job-import', payload);
};

