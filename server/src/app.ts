import express from 'express';
import cors from 'cors';
import importRoutes from './routes/importRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', importRoutes);

export default app;

