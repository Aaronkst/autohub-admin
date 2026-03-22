import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Proxy /kbz to KBZ Pay (mirrors vite.config.ts proxy for production)
app.use(
  '/kbz',
  createProxyMiddleware({
    target: 'https://uat-miniapp.kbzpay.com',
    changeOrigin: true,
    pathRewrite: { '^/kbz': '' },
  })
);

// Serve the built Vite app
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback – all unmatched routes serve index.html so React Router works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
