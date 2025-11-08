# Job Import System (TypeScript MERN)

This repo implements a full-stack job import pipeline using TypeScript, Next.js, Express, MongoDB Atlas, Redis (BullMQ), and cron-based feed ingestion. The system fetches remote XML job feeds, converts them to JSON, enqueues processing tasks, stores/upserts jobs in MongoDB, and logs each import run for administrators to review in a Next.js dashboard.

## Project Structure 
```
.
├── client/              # Next.js (App Router) admin UI
├── server/              # Express API, BullMQ workers, cron scheduler
├── docs/                # Architecture and design documents
├── README.md            # Information About installation 
├── .gitignore           # Files to ignore
└── package.json         # Root scripts for combined workflows
```

## Prerequisites
- Used Typescript for better Workflow and Scalability.
- Node.js 18+.
- npm 9+.
- MongoDB Atlas (Cloud one)
- Redis Cloud 

## Quick Start to setup the project 

1. **Install dependencies for client and server at same time**

   ```bash
   npm run install:all

   ```


2. **Configure environment variables**
   - Make a file in `server/.env` and fill your connection strings as from the `server/.env.example`.
   - Make a file in `client/.env` and set the backend API URL (e.g., `http://localhost:5000`).

what to include in the Env variable
a. server env: 
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster-url/dbname  // From the mongodb atlas 
REDIS_URL=redis://host:port   // from Radis cloud
REDIS_USERNAME=default
REDIS_PASSWORD=<password>   // Get password from the snippet it gives for different lan at right side
BULL_CONCURRENCY=5
CRON_SCHEDULE=0 * * * *

```
client env: assigning the port for frontend.

```
NEXT_PUBLIC_API_URL=http://localhost:5000

```
3. **Run the stack locally**
## Go into the server and run this after setting the env variables
   ```bash
   npm run dev
   ```

## Go into the client and run this command after setting the env variable
   ```bash
   npm run dev
   ```
   
- localhost: `http://localhost:3000`

## 4.**Visit the admin UI** at `http://localhost:3000/import-history` to monitor import runs for history logs.
## Deployment Notes
-**Backend**: Deploy `server/` to any Node-compatible host (Render, Railway, etc.).
              Provide environment variables for MongoDB, Redis, and optional `CRON_SCHEDULE` / `BULL_CONCURRENCY` overrides.

- **Frontend**: Deploy `client/` to Vercel. Set `NEXT_PUBLIC_API_URL` to your hosted backend URL before deploy.


## Key Features
- Hourly cron job (`node-cron`) triggers fetching of nine XML job feeds.
- `xml2js` parses XML to JSON; jobs are normalized and enqueued via BullMQ.
- Dedicated BullMQ worker upserts jobs into MongoDB and writes summary entries to `import_logs`.
- Import history endpoint exposes paginated logs for the Next.js admin UI.
- Tailwind-powered interface replicates the reference design for monitoring import runs.

## Testing & Verification

- Use `GET /api/import` to manually enqueue all feeds on-demand.
- Import history available via `GET /api/import-history?page=1&limit=10`.
- Health check at `GET /health`.

## 5. For more implementation details as System Design, refer to `docs/architecture.md`.

----------------------------------------------------x-----------------------------------------------------------