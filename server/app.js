import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Locally, load environment from server/.env. On Vercel there is no such file
// and the variables come from the project's Environment Variables instead;
// dotenv silently does nothing when the file is absent, so this is safe.
dotenv.config({ path: path.join(__dirname, '.env') });

// Builds the API-only Express app. This is imported both by the local dev
// server (server/index.js) and by the Vercel serverless entry (api/index.js).
const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Ensure a live DB connection before handling any API request. Cached across
// warm invocations, so this is cheap after the first call.
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ error: 'Database connection failed.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Any unmatched /api route returns JSON 404 (never HTML).
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// Centralized error handler so route exceptions return JSON, not HTML.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error.' });
});

export default app;
