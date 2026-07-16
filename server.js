import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import dotenv from 'dotenv';

// Environment variables are injected by the hosting platform (Hostinger dashboard).
// However, during local development, we load the .env file.
const NODE_ENV = process.env.NODE_ENV || 'production';
if (NODE_ENV !== 'production') {
  dotenv.config();
}

// ─── Validate Required Variables ──────────────────────────────────────────────
const REQUIRED_ENV_VARS = ['DATABASE_URL', 'AUTH_SECRET'];
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// ─── Server Configuration ──────────────────────────────────────────────────────
const dev = NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = parseInt(process.env.PORT, 10) || 3000;

// ─── Next.js App ──────────────────────────────────────────────────────────────
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`🚀 Server running on http://${hostname}:${port} [${NODE_ENV}]`);
    });
});