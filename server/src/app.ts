import cors from 'cors';
import express from 'express';
import { errorHandler, notFound } from './lib/errors.js';
import { statsRouter } from './routes/stats.js';
import { tasksRouter } from './routes/tasks.js';

export const app = express();

// Same-origin in production (Vercel); CLIENT_ORIGIN only matters for local dev without the Vite proxy.
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});
app.use('/api/tasks', tasksRouter);
app.use('/api', statsRouter);
app.use(notFound);
app.use(errorHandler);
