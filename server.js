import { createServer } from 'http';
import next from 'next';
import dotenv from 'dotenv';

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



// ─── Server Configuration ──────────────────────────────────────────────────────
const dev = NODE_ENV !== 'production';
const rawPort = process.env.PORT;
const port = rawPort ? (isNaN(Number(rawPort)) ? rawPort : parseInt(rawPort, 10)) : 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

// ─── Next.js App ──────────────────────────────────────────────────────────────
const app = next({
  dev,
  hostname: typeof port === 'number' ? hostname : undefined,
  port: typeof port === 'number' ? port : undefined,
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  server.once('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });

  if (typeof port === 'string') {
    server.listen(port, () => {
      console.log(`🚀 Server listening on socket ${port} [${NODE_ENV}]`);
    });
  } else {
    server.listen(port, hostname, () => {
      console.log(`🚀 Server running on http://${hostname}:${port} [${NODE_ENV}]`);
    });
  }
});