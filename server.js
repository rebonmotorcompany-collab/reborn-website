import { createServer } from 'http';
import next from 'next';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

// ─── Prisma Panic Recovery ────────────────────────────────────────────────────
// PrismaClientRustPanicError is non-recoverable. The engine binary has crashed
// and will remain in a zombie state. The only safe recovery is to exit — the
// hosting platform (Hostinger) will automatically restart the process.
function handleFatalError(err) {
  if (
    err &&
    (err.name === 'PrismaClientRustPanicError' ||
      (err.message && err.message.includes('PANIC')))
  ) {
    console.error('💥 Prisma Query Engine panicked (non-recoverable). Restarting process...', err.message);
    process.exit(1);
  }
}
process.on('uncaughtException', (err) => {
  handleFatalError(err);
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  handleFatalError(reason);
  console.error('Unhandled rejection:', reason);
});

// Environment variables are injected by the hosting platform (Hostinger dashboard).
const NODE_ENV = process.env.NODE_ENV || 'production';
dotenv.config();

// ─── Validate Required Variables ──────────────────────────────────────────────
const REQUIRED_ENV_VARS = ['DATABASE_URL', 'AUTH_SECRET'];
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// ─── Auto DB Schema Sync on Server Startup ──────────────────────────────────
try {
  console.log('🔄 Syncing database schema with MySQL...');
  execSync('npx prisma db push --accept-data-loss=false', { stdio: 'inherit' });
  console.log('✅ Database schema in sync.');
} catch (dbErr) {
  console.warn('⚠️ DB Schema Push Warning (Server continuing):', dbErr.message);
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
      await handle(req, res);
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