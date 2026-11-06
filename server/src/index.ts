import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { openDatabase } from './database.js';

const port = Number(process.env['PORT'] ?? 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be an integer from 0 to 65535');
const db = openDatabase();
const app = createApp(db, {
  staticDir: fileURLToPath(new URL('../../web/dist/ops-dashboard/browser/', import.meta.url)),
  onError: error => console.error('API request failed:', error instanceof Error ? error.message : 'Unknown error'),
});
const server = app.listen(port, '127.0.0.1', () => {
  const address = server.address();
  if (address && typeof address !== 'string') console.log(`Dashboard ready at http://localhost:${address.port}`);
});
server.on('error', error => { db.close(); console.error(error.message); process.exitCode = 1; });
let stopping = false;
function shutdown() {
  if (stopping) return;
  stopping = true;
  server.close(() => { db.close(); });
  const timeout = setTimeout(() => { server.closeAllConnections(); }, 5000);
  timeout.unref();
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
