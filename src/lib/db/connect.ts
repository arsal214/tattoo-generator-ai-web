import mongoose from "mongoose";
import { env } from "../env";

// Cache the connection across hot reloads and serverless invocations.
const g = globalThis as unknown as { _mongoose?: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> } };
const cache = (g._mongoose ??= {});

export async function connectDB() {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(env().MONGODB_URI, { bufferCommands: false, maxPoolSize: 10, serverSelectionTimeoutMS: 8000 });
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = undefined;
    throw e;
  }
  return cache.conn;
}
