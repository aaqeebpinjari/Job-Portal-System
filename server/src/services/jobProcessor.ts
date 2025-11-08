import { JobModel } from '../models/Job';
import { ImportLogModel } from '../models/ImportLog';
import { JobImportPayload } from '../types/jobs';
import { logger } from '../utils/logger';

export interface JobProcessResult {
  sourceUrl: string;
  totalFetched: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: { jobId?: string; reason: string }[];
}

export const processJobImport = async ({ jobs, sourceUrl }: JobImportPayload): Promise<JobProcessResult> => {
  let newJobs = 0;
  let updatedJobs = 0;
  const failedJobs: { jobId?: string; reason: string }[] = [];

  for (const job of jobs) {
    if (!job.url) {
      failedJobs.push({ reason: 'Missing job URL, skipping record.' });
      continue;
    }

    try {
      const updateResult = await JobModel.updateOne(
        { url: job.url },
        {
          $set: {
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            url: job.url,
            raw: job.raw,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      if (updateResult.upsertedCount && updateResult.upsertedCount > 0) {
        newJobs += 1;
      } else if (updateResult.modifiedCount && updateResult.modifiedCount > 0) {
        updatedJobs += 1;
      } else {
        // matched but not modified (identical data). Count as updated for visibility.
        updatedJobs += 1;
      }
    } catch (error) {
      logger.error({ error, job }, 'Failed to process job');
      failedJobs.push({ jobId: job.url, reason: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  const result: JobProcessResult = {
    sourceUrl,
    totalFetched: jobs.length,
    newJobs,
    updatedJobs,
    failedJobs
  };

  await ImportLogModel.create({
    sourceUrl,
    timestamp: new Date(),
    totalFetched: result.totalFetched,
    totalImported: newJobs + updatedJobs,
    newJobs,
    updatedJobs,
    failedJobs
  });

  return result;
};

