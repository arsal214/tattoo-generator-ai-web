/**
 * Throwaway local MongoDB (replica set, so transactions are exercised) for development without installing MongoDB.
 *   npm run dev:db     → prints a MONGODB_URI to put in .env.local. Data is deleted when the process stops.
 */
import { MongoMemoryReplSet } from "mongodb-memory-server";

async function main() {
  const rs = await MongoMemoryReplSet.create({ replSet: { count: 1 }, instanceOpts: [{ port: 27018 }] });
  console.log(`MONGODB_URI=${rs.getUri("tattoogenerator")}`);
  console.log("Local dev database running. Press Ctrl+C to stop.");
  process.on("SIGINT", async () => {
    await rs.stop();
    process.exit(0);
  });
}

main();
