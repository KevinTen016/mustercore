// Runs DB migrations then starts Next.js with graceful SIGTERM shutdown.
import http from 'node:http';
import { execFileSync } from 'node:child_process';

// Run migrations before the server starts — required for Railway / single-container deploys.
// In docker-compose this is handled by the separate `migrate` service; here we do it inline.
console.log(JSON.stringify({ level: 'info', msg: 'running prisma migrate deploy', ts: Date.now() }));
try {
  execFileSync('node', ['node_modules/prisma/build/index.js', 'migrate', 'deploy'], {
    stdio: 'inherit',
    env: process.env,
  });
} catch (err) {
  console.error(JSON.stringify({ level: 'error', msg: 'migration failed — aborting', ts: Date.now() }));
  process.exit(1);
}

// Intercept http.createServer before server.js runs so we can capture the instance.
const _origCreate = http.createServer;
let _server = null;

http.createServer = function (...args) {
  _server = _origCreate.apply(http, args);
  return _server;
};

await import('./server.js');

http.createServer = _origCreate; // restore

async function gracefulShutdown(signal) {
  console.log(JSON.stringify({ level: 'info', msg: 'shutdown initiated', signal, ts: Date.now() }));

  // Force-exit if drain takes > 10 s (Docker SIGKILL would fire at stop_grace_period anyway).
  setTimeout(() => {
    console.log(JSON.stringify({ level: 'warn', msg: 'force exit after drain timeout' }));
    process.exit(1);
  }, 10_000).unref();

  if (_server) {
    _server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
