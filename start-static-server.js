// Simple static file server for development
// Usage: node start-static-server.js [port]

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = parseInt(process.env.PORT || process.argv[2] || '5000', 10);
const root = process.cwd();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

function send404(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('404 Not Found');
}

function send500(res, err) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('500 Internal Server Error\n' + String(err));
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, `http://localhost`).pathname);
    if (urlPath.includes('..')) return send404(res);

    let filePath = path.join(root, urlPath);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        // try index.html for root
        if (urlPath === '/' || urlPath === '') {
          const index = path.join(root, 'index.html');
          return fs.readFile(index, (e, data) => {
            if (e) return send404(res);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(data);
          });
        }
        return send404(res);
      }

      if (stats.isDirectory()) {
        const index = path.join(filePath, 'index.html');
        return fs.readFile(index, (e, data) => {
          if (e) return send404(res);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(data);
        });
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      res.statusCode = 200;
      res.setHeader('Content-Type', type);
      const stream = fs.createReadStream(filePath);
      stream.on('error', (err) => send500(res, err));
      stream.pipe(res);
    });
  } catch (err) {
    send500(res, err);
  }
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
  console.log('Serving directory:', root);
});

module.exports = server;
