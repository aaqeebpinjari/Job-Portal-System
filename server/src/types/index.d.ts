declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    MONGO_URI: string;
    REDIS_URL: string;
    REDIS_USERNAME?: string;
    REDIS_PASSWORD?: string;
    BULL_CONCURRENCY?: string;
    CRON_SCHEDULE?: string;
  }
}

