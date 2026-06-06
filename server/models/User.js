import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Application user. Only a single user is seeded for this app, but the schema
// supports more. Passwords are always stored hashed (never plaintext).
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash and set the password.
userSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

// Compare a candidate password against the stored hash.
userSchema.methods.verifyPassword = function verifyPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
