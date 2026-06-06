import jwt from 'jsonwebtoken';

// Express middleware that validates the Bearer JWT and attaches the user id to
// the request. Rejects with 401 when the token is missing or invalid.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.username = payload.username;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}
