// Applies database migrations during deploys using one variable: DATABASE_URL.
// Migrations need a direct (non-pooled) connection. Neon's pooled host contains "-pooler",
// so we strip it here instead of asking for a second variable.
import { spawnSync } from 'node:child_process';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set. Add it in Vercel: Settings -> Environment Variables.');
  process.exit(1);
}

const direct = url.replace('-pooler', '');
const result = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: direct },
});
process.exit(result.status ?? 1);
