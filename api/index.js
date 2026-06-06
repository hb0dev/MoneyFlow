import app from '../server/app.js';

// Vercel serverless entry. An Express app is itself a (req, res) handler, so
// exporting it lets Vercel route every /api/* request through it.
export default app;
