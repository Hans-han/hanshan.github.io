import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT || 4177);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

function send(response, statusCode, body, contentType = 'text/plain; charset=utf-8') {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.end(body);
}

function renderPreviewPage() {
  const source = fs.readFileSync(path.join(repoRoot, '_tabs/hongloumeng.md'), 'utf8');
  const body = source
    .replace(/^---[\s\S]*?---\s*/, '')
    .replaceAll('{{ site.baseurl }}', '');

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>红楼梦漫画预览</title>
</head>
<body>
${body}
</body>
</html>`;
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', 'http://localhost');

  if (url.pathname === '/' || url.pathname === '/hongloumeng/') {
    send(response, 200, renderPreviewPage(), 'text/html; charset=utf-8');
    return;
  }

  const relativePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, '');
  const filePath = path.join(repoRoot, relativePath);
  if (!filePath.startsWith(repoRoot)) {
    send(response, 403, 'forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(response, 404, 'not found');
      return;
    }

    send(response, 200, data, mimeTypes[path.extname(filePath)] || 'application/octet-stream');
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`preview http://127.0.0.1:${port}/hongloumeng/`);
});
