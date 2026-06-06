import { Router } from 'express';
import { Transaction } from '../models/Transaction.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Every route below requires a valid token; data is always scoped to req.userId.
router.use(requireAuth);

// Normalize an incoming transaction payload.
function sanitize(body) {
  return {
    amount: Number(body.amount) || 0,
    type: body.type === 'income' ? 'income' : 'expense',
    category: typeof body.category === 'string' ? body.category : 'other',
    note: typeof body.note === 'string' ? body.note.trim() : '',
    date: body.date || new Date().toISOString().slice(0, 10),
  };
}

// GET /api/transactions — list the user's transactions, newest date first.
router.get('/', async (req, res) => {
  const list = await Transaction.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });
  res.json(list);
});

// POST /api/transactions — create one.
router.post('/', async (req, res) => {
  const tx = await Transaction.create({ ...sanitize(req.body), user: req.userId });
  res.status(201).json(tx);
});

// PUT /api/transactions/:id — update one (only if owned by the user).
router.put('/:id', async (req, res) => {
  const tx = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    sanitize(req.body),
    { new: true }
  );
  if (!tx) return res.status(404).json({ error: 'Transaction not found.' });
  res.json(tx);
});

// DELETE /api/transactions/:id — delete one.
router.delete('/:id', async (req, res) => {
  const result = await Transaction.deleteOne({ _id: req.params.id, user: req.userId });
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Transaction not found.' });
  }
  res.json({ ok: true });
});

// DELETE /api/transactions — clear all of the user's transactions.
router.delete('/', async (req, res) => {
  await Transaction.deleteMany({ user: req.userId });
  res.json({ ok: true });
});

// POST /api/transactions/bulk — replace the whole set (used by JSON restore).
router.post('/bulk', async (req, res) => {
  const list = Array.isArray(req.body?.transactions) ? req.body.transactions : [];
  await Transaction.deleteMany({ user: req.userId });
  const docs = list.map((t) => ({ ...sanitize(t), user: req.userId }));
  const inserted = docs.length ? await Transaction.insertMany(docs) : [];
  res.json(inserted);
});

export default router;
