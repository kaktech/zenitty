import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

// Imported after dotenv so DATABASE_URL is set before Prisma is created.
const { app } = await import('./app.js');
const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log(`Zenitty API listening on http://localhost:${port}`);
});
