import mongoose from 'mongoose';

// Serverless-friendly MongoDB connection. Lambda invocations reuse the same
// container when warm, so we cache the connection (and the in-flight promise)
// on the global object to avoid opening a new connection on every request,
// which would quickly exhaust the Atlas connection limit.
let cached = globalThis._mongooseCache;
if (!cached) {
  cached = globalThis._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable.');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
