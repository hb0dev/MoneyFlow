import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/User.js';

// Load environment from server/.env regardless of the current working dir.
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

// Seeds (or updates) the single application user defined by SEED_USERNAME /
// SEED_PASSWORD. Safe to run repeatedly — it upserts rather than duplicating.
async function seed() {
  const username = (process.env.SEED_USERNAME || 'habibmendas').toLowerCase().trim();
  const password = process.env.SEED_PASSWORD || 'habibmendas';

  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in server/.env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  let user = await User.findOne({ username });
  if (!user) {
    user = new User({ username });
    console.log(`Creating user "${username}".`);
  } else {
    console.log(`Updating password for existing user "${username}".`);
  }
  await user.setPassword(password);
  await user.save();

  console.log('Seed complete.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
