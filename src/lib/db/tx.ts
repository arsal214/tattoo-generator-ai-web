import mongoose, { type ClientSession } from "mongoose";
import { connectDB } from "./connect";

let supportsTx: boolean | undefined;

/**
 * Runs `fn` inside a MongoDB transaction when the deployment supports it (replica set / Atlas / mongos),
 * otherwise runs it directly with `session === undefined`. Every money path is written so it is also
 * safe without transactions (unique-key gates + conditional atomic updates); transactions add
 * all-or-nothing rollback on top.
 */
export async function atomically<T>(fn: (session?: ClientSession) => Promise<T>): Promise<T> {
  await connectDB();
  if (supportsTx === undefined) {
    const hello = await mongoose.connection.db!.admin().command({ hello: 1 });
    supportsTx = Boolean(hello.setName) || hello.msg === "isdbgrid";
  }
  if (!supportsTx) return fn(undefined);
  return mongoose.connection.transaction((session) => fn(session));
}

export const isDuplicateKey = (e: unknown): boolean =>
  typeof e === "object" && e !== null && (e as { code?: number }).code === 11000;
