import { MongoClient } from "mongodb";

type MongoGlobal = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getMongoClientPromise() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const globalForMongo = globalThis as MongoGlobal;

  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri, {
      appName: "wdd430-group-project",
    }).connect();
  }

  return globalForMongo._mongoClientPromise;
}

export async function getDatabase() {
  const client = await getMongoClientPromise();
  return process.env.MONGODB_DB ? client.db(process.env.MONGODB_DB) : client.db();
}
