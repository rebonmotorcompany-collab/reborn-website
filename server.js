import express from 'express';
import next from 'next';
import { parse } from 'url';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

const dev = process.env.NODE_ENV !== 'production';

// Load the appropriate environment variables based on the environment
dotenv.config({ path: dev ? '.developer.env' : '.production.env' });

// Safely update database schema and seed data (runs before server starts)
try {
  console.log('Running database migrations and checking data safely...');
  // migrate deploy only applies new structure, never deletes data
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  // seed only inserts missing data (because your seed uses upsert)
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('Database sync complete.');
} catch (error) {
  console.error('Database sync failed:', error);
}

const hostname = 'localhost';
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.status(500).send('internal server error');
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
