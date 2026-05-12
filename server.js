import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || 'localhost';
const ROOT = dirname(fileURLToPath(import.meta.url));

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.hex': 'text/plain; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
};

function sendError(response, statusCode, message) {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(message);
}

function getFilePath(requestUrl) {
  const url = new URL(requestUrl, `http://${HOST}:${PORT}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.replace(/^\/+/, '');
  const normalizedPath = normalize(relativePath).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(ROOT, normalizedPath);
  const resolvedPath = resolve(filePath);

  if (resolvedPath !== ROOT && !resolvedPath.startsWith(`${ROOT}${sep}`)) {
    return null;
  }

  return resolvedPath;
}

const server = createServer((request, response) => {
  const filePath = getFilePath(request.url || '/');

  if (!filePath) {
    sendError(response, 403, 'Forbidden');
    return;
  }

  let stats;
  try {
    stats = statSync(filePath);
  } catch {
    sendError(response, 404, 'Not found');
    return;
  }

  if (!stats.isFile()) {
    sendError(response, 404, 'Not found');
    return;
  }

  const contentType = MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': contentType });
  createReadStream(filePath).pipe(response);
});

server.listen(PORT, HOST, () => {
  console.log(`RISC-II 8 Simulator running at http://${HOST}:${PORT}`);
});
