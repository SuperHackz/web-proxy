// api/index.js
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: '', // Will be set dynamically
  changeOrigin: true,
  router: (req) => {
    // Extract target URL from query parameter
    const url = new URL(req.url, `https://${req.headers.host}`);
    const targetUrl = url.searchParams.get('url');
    return targetUrl;
  },
  pathRewrite: {
    '^/api': '', // Remove /api prefix
  },
  onProxyReq: (proxyReq, req, res) => {
    // Remove identifying headers for privacy
    proxyReq.removeHeader('referer');
    proxyReq.removeHeader('origin');
    proxyReq.removeHeader('user-agent');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  }
});

// Export the serverless function
module.exports = (req, res) => {
  // Handle the proxy request
  if (req.url.includes('?url=')) {
    return proxy(req, res);
  } else {
    // Return error for requests without URL parameter
    res.status(400).json({ error: 'URL parameter required' });
  }
};
