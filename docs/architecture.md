# Architecture Overview for The Given project
## High-Level Flow

1. **Scheduler / Manual Trigger**
   - `node-cron` schedules `fetchAndEnqueueAllFeeds()` hourly (configurable via `CRON_SCHEDULE`).
   - `GET /api/import` allows manual triggering via REST.

2. **Feed Fetching Service**
   - `fetchJobs.ts` iterates over the configured feed URLs.
   - Each feed is fetched with `axios`, parsed using `xml2js`, normalized into a uniform job shape, and enqueued on the `jobImportQueue` via BullMQ.

3. **Queue Processing Worker**
   - `worker.ts` spins up a BullMQ worker with configurable concurrency (`BULL_CONCURRENCY`).
   - The worker calls `processJobImport()` which upserts jobs into MongoDB (`jobs` collection) and aggregates metrics (new, updated, failed).
   - A summary document for each import run is recorded in `import_logs`.

4. **Persistence**
   - `JobModel` stores canonical job records, keyed by unique `url`.
   - `ImportLogModel` captures run metadata for reporting.

5. **Admin UI**
   - Next.js App Router page `/import-history` fetches paginated logs from the backend (`/api/import-history`).
   - Tailwind CSS styles replicate the provided sample table for quick operational insight.

## Key Modules
- `server/src/config/*`: Centralizes MongoDB and Redis setup, loads environment variables.
- `server/src/services/fetchJobs.ts`: Feed ingestion, XML parsing, normalization, queue publishing.
- `server/src/services/jobProcessor.ts`: Worker-facing logic to upsert jobs and persist import summaries.
- `server/src/controllers/*`: HTTP-facing layer bridging routes to services.
- `client/app/import-history/page.tsx`: Client-side React UI with pagination and source filtering.

## Error Handling & Observability

- Structured logging via `pino`/`pino-pretty` for local readability.
- Queue jobs configured with exponential backoff (3 attempts, 5s delay).
- Failed job details recorded per import run for later review.

## Deployment Considerations

- Deploy backend to a Node host with managed MongoDB & Redis services.
- Deploy frontend to Vercel; proxy API requests via `NEXT_PUBLIC_API_URL`.
- Ensure environment variables align with `.env.example` files.