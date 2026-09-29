import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';

config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Zenitty API listening on http://localhost:${port}`);
});
