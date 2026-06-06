import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Issue a signed JWT for a valid user.
function issueToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/login — validate credentials, return a token.
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = await User.findOne({ username: String(username).toLowerCase().trim() });
  if (!user || !(await user.verifyPassword(password))) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  return res.json({ token: issueToken(user), user: { username: user.username } });
});

// GET /api/auth/me — confirm the current token is still valid.
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.username } });
});

export default router;
