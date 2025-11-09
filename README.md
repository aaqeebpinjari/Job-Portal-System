# 🚀 Job Import System (MERN + Next.js + Redis + TypeScript)
This repository implements a full-stack job import pipeline using TypeScript, Next.js, Express, MongoDB Atlas, Redis (BullMQ), and cron-based feed ingestion.
The system fetches remote XML job feeds, converts them to JSON, enqueues processing tasks, stores/upserts jobs in MongoDB, and logs each import run for administrators to review via a modern Next.js dashboard.

---
## 🎬 Project Demo

<p align="center">
  <a href="https://drive.google.com/file/d/1WMysVjHrbDf-3zCWVxw-jn7ibxEXWZ9z/view?usp=sharing" target="_blank">
    <img src="https://img.shields.io/badge/🎥%20Watch%20Demo-Google%20Drive-blue?style=for-the-badge&logo=google-drive" alt="Watch Demo">
  </a>
</p>

> Watch the complete walkthrough of the **Job Import System** showing job fetching, Redis queue processing, and MongoDB import tracking.

---

## 🌐 Live Links
 Deployed link : https://job-portal-frontend-eight-alpha.vercel.app

---

## 📁Project Structure
```
.
├── client/              # Next.js (App Router) admin UI
├── server/              # Express API, BullMQ workers, cron scheduler
├── docs/                # Architecture and design documents
├── README.md            # Information About installation 
├── .gitignore           # Files to ignore
└── package.json         # Root scripts for combined workflows
```

## ⚙️ Prerequisites
- 🧠 TypeScript — for scalability and strong typing
- 🟢 Node.js 18+
- 📦 npm 9+
- ☁️ MongoDB Atlas (for persistent data)
- 🔁 Redis Cloud (for queue management)
---

## ⚡Quick Start to setup the project 

1️⃣ **Install dependencies for client and server at same time**

   ```bash
   npm run install:all
   ```


2️⃣ **Configure environment variables**
   - Make a file in `server/.env` and fill your connection strings as from the `server/.env.example`.
   - Make a file in `client/.env` and set the backend API URL (e.g., `http://localhost:5000`).

what to include in the Env variable
a. 💻 server env: 
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
💻 client env: assigning the port for frontend.
```
NEXT_PUBLIC_API_URL=http://localhost:5000

```

3️⃣  **Run the stack locally**

1. Connect Databases
MongoDB Atlas:
```
Create a cluster → get the connection string → paste it in server/.env under ```MONGO_URI.

```

2. Redis Cloud:
```

Create an account → go to Connect → copy connection snippet → paste credentials in server/.env.

```

3. Go into the server or backend and run this after setting the env variables

   ```bash
   npm run dev
   ```

4. Go into the client and run this command after setting the env variable
   ```bash
   npm run dev
   ```
   
- localhost: `http://localhost:3000` Will show result Like this
  
<img width="1913" height="876" alt="image" src="https://github.com/user-attachments/assets/8dd019e8-c549-422b-8988-7cc08184fdcc" />


5. ☁️ **Visit the admin UI** at `http://localhost:3000/` to monitor import runs for history logs will Given as Sample image output.
<img width="1919" height="976" alt="image" src="https://github.com/user-attachments/assets/540f0a2e-6c85-4bfc-ae97-dd4589950363" />


## 4️⃣ Deployment Notes
-**Backend**: Deploy `server/` to any Node-compatible host (Render, Railway, etc.).
              Provide environment variables for MongoDB, Redis, and optional `CRON_SCHEDULE` / `BULL_CONCURRENCY` overrides.

- **Frontend**: Deploy `client/` to Vercel. Set `NEXT_PUBLIC_API_URL` to your hosted backend URL before deploy.


## ✨ Key Features
- Hourly cron job (`node-cron`) triggers fetching of nine XML job feeds.
- `xml2js` parses XML to JSON; jobs are normalized and enqueued via BullMQ.
- Dedicated BullMQ worker upserts jobs into MongoDB and writes summary entries to `import_logs`.
- Import history endpoint exposes paginated logs for the Next.js admin UI.
- Tailwind-powered interface replicates the reference design for monitoring import runs.

## 🧪 Testing & Verification

- Use `GET /api/import` to manually enqueue all feeds on-demand.
- Import history available via `GET /api/import-history?page=1&limit=10`.
- Health check at `GET /health`.

## 5. For more implementation details as System Design, refer to `docs/architecture.md`.

---
