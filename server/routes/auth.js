import { Router } from 'express';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// The single app user's credentials come entirely from environment variables
// (set locally in server/.env, or in the Vercel dashboard for deployment).
function configuredCredentials() {
  return {
    username: (process.env.AUTH_USERNAME || '').toLowerCase().trim(),
    password: process.env.AUTH_PASSWORD || '',
  };
}

// Constant-time string comparison to avoid leaking length/timing information.
function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Issue a signed JWT. The subject is the username, which is also used to scope
// the user's transactions in the database.
function issueToken(username) {
  return jwt.sign({ sub: username, username }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

// POST /api/auth/login — validate credentials against env vars, return a token.
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const expected = configuredCredentials();
  if (!expected.username || !expected.password) {
    return res
      .status(500)
      .json({ error: 'Server is missing AUTH_USERNAME / AUTH_PASSWORD.' });
  }

  const okUser = safeEqual(String(username).toLowerCase().trim(), expected.username);
  const okPass = safeEqual(String(password), expected.password);
  if (!okUser || !okPass) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  return res.json({ token: issueToken(expected.username), user: { username: expected.username } });
});

// GET /api/auth/me — confirm the current token is still valid.
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.username } });
});

export default router;
