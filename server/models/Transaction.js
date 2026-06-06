import mongoose from 'mongoose';

// A single income/expense transaction, scoped to the owning user (identified
// by username, which comes from the env-configured credentials).
const transactionSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, default: 'other' },
    note: { type: String, default: '' },
    // Stored as yyyy-MM-dd to match the frontend's canonical date format.
    date: { type: String, required: true },
  },
  { timestamps: true }
);

// Expose `id` (string) and hide Mongo internals so the API shape matches what
// the React app already expects.
transactionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.user;
  },
});

// Reuse an already-compiled model if present. On Vercel, a warm lambda may
// import this module more than once; calling mongoose.model twice would throw
// an OverwriteModelError without this guard.
export const Transaction =
  mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
