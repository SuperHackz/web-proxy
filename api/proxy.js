// pages/api/proxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false, // Important for proxying requests with a body
    externalResolver: true, // Tells Next.js the handler is async/external
  },
};

const proxy = createProxyMiddleware({
  target: 'https://example.com', // Replace with your target
  changeOrigin: true,
  pathRewrite: { '^/api/proxy': '' }, // Adjust as needed
});

export default function handler(req, res) {
  // Pass a dummy next function to satisfy the middleware signature
  return proxy(req, res, (err) => {
    if (err) {
      res.status(500).send('Proxy error');
    }
  });
}
