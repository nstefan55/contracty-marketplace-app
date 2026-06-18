import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach } from "vitest";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

// Load throwaway env values from the example file. Never load .env.test directly:
// on this developer's machine it still contains live production-looking secrets.
config({ path: path.join(root, ".env.test.example") });

process.env.NODE_ENV = "test";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  // Reset the cached connection promise inside config/database.js so it
  // re-dials our in-memory instance instead of trying the placeholder URI.
  if (globalThis._mongoose) globalThis._mongoose = { conn: null, promise: null };
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
}, 60000);

beforeEach(async () => {
  // Wipe every collection between tests so they don't bleed state.
  const collections = mongoose.connection.collections;
  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({});
  }
});
