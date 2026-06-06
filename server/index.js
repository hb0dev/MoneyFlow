import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import app from './app.js';
import { connectDB } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Local entry point. On Vercel the app runs as a serverless function
// (api/index.js) and the frontend is served by Vercel's CDN; this file is only
// used for local development (`npm run server`) and local production preview
// (`npm start`), where Express also serves the built frontend from /dist.
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB();
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
