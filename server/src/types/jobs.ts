export interface NormalizedJob {
  title: string;
  company: string;
  location: string;
  type: string;
  url: string;
  raw: Record<string, unknown>;
}

export interface JobImportPayload {
  sourceUrl: string;
  jobs: NormalizedJob[];
}

export interface JobImportSummary {
  sourceUrl: string;
  totalFetched: number;
}

