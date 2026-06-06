import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment from server/.env regardless of the current working dir.
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health check.
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// In production, serve the built React app from /dist so everything runs on a
// single origin (no proxy needed once built).
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Centralized error handler so route exceptions return JSON, not HTML.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error.' });
});

const PORT = process.env.PORT || 4000;

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in server/.env');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
