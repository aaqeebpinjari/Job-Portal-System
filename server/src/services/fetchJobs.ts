import axios from 'axios';
import { addJobToQueue } from '../queues/queue';
import { parseXml } from '../utils/xmlParser';
import { logger } from '../utils/logger';
import { JobImportSummary, JobImportPayload, NormalizedJob } from '../types/jobs';


//API to fetch data from here 
export const JOB_FEED_URLS: string[] = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
  'https://www.higheredjobs.com/rss/articleFeed.cfm'
];

//forming an array
const toArray = <T>(value: T | T[] | undefined): T[] =>
  {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const getText = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (Array.isArray(value)) {
    return getText(value[0]);
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (obj._) {
      return getText(obj._);
    }
    if (obj.href) {
      return getText(obj.href);
    }
    const firstKey = Object.keys(obj)[0];
    if (firstKey) {
      return getText(obj[firstKey]);
    }
  }
  return '';
};

const normalizeJobs = (items: unknown[]): NormalizedJob[] => {
  return items
    .map((item) => {
      const record = item as Record<string, unknown>;
      const url = getText(record.link) || getText(record.guid) || getText(record.url);
      if (!url) {
        return null;
      }

      const title = getText(record.title) || 'Untitled role';
      const company =
        getText(record['job:company']) || getText(record.company) || getText(record['dc:creator']) || 'Unknown company';
      const location = getText(record['job:location']) || getText(record.location) || 'Remote';
      const type =
        getText(record['job:job_type']) || getText(record.type) || getText(record.employmentType) || 'Unknown';

      return {
        title,
        company,
        location,
        type,
        url,
        raw: record
      } satisfies NormalizedJob;
    })
    .filter((job): job is NormalizedJob => Boolean(job));
};

const extractItems = (parsed: Record<string, any>): unknown[] => {
  if (!parsed) return [];
  if (parsed.rss?.channel?.item) {
    return toArray(parsed.rss.channel.item);
  }
  if (parsed.feed?.entry) {
    return toArray(parsed.feed.entry);
  }
  if (parsed.channel?.item) {
    return toArray(parsed.channel.item);
  }
  return [];
};

export const fetchAndEnqueueAllFeeds = async (): Promise<JobImportSummary[]> => {
  const summaries: JobImportSummary[] = [];

  for (const url of JOB_FEED_URLS) {
    try {
      const response = await axios.get(url, { responseType: 'text' });
      const parsed = await parseXml<Record<string, any>>(response.data);
      const items = extractItems(parsed);
      const jobs = normalizeJobs(items);

      const payload: JobImportPayload = {
        sourceUrl: url,
        jobs
      };

      await addJobToQueue(payload);

      summaries.push({ sourceUrl: url, totalFetched: jobs.length });
      logger.info({ sourceUrl: url, total: jobs.length }, 'Enqueued jobs for processing');
    } catch (error) {
      logger.error({ error, sourceUrl: url }, 'Failed to fetch feed');
      summaries.push({ sourceUrl: url, totalFetched: 0 });
    }
  }

  return summaries;
};

