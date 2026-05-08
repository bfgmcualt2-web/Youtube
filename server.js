const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(morgan('dev'));

// Home route
app.get('/', (req, res) => {
  res.send(`
    <h1>YouTube Embed Proxy</h1>
    <p>Usage:</p>
    <pre>/youtube/embed/VIDEO_ID</pre>
    <p>Example:</p>
    <a href="/youtube/embed/dQw4w9WgXcQ">
      Open Example Video
    </a>
  `);
});

// Proxy YouTube embed routes only
app.use(
  '/youtube',
  createProxyMiddleware({
    target: 'https://www.youtube.com',
    changeOrigin: true,
    secure: true,

    pathRewrite: {
      '^/youtube': ''
    },

    onProxyReq: (proxyReq) => {
      proxyReq.setHeader(
        'User-Agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'
      );
    },

    onProxyRes: (proxyRes) => {
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
    }
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
