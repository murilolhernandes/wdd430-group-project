import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import mongoose from "mongoose";

const COLLECTION_NAME = "products";

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const seedFilePath = resolve(process.cwd(), "src/data/products.json");
  const rawSeedData = await readFile(seedFilePath, "utf8");
  const seedProducts = JSON.parse(rawSeedData);

  if (!Array.isArray(seedProducts)) {
    throw new Error("Product seed data must be an array.");
  }

  await mongoose.connect(uri);

  try {
    const database = mongoose.connection.db;
    const collection = database.collection(COLLECTION_NAME);

    await collection.createIndex({ slug: 1 }, { unique: true });

    const operations = seedProducts.map((product) => ({
      updateOne: {
        filter: { slug: product.slug },
        update: { $set: product },
        upsert: true,
      },
    }));

    const result = await collection.bulkWrite(operations, { ordered: false });

    console.log(
      `Seeded ${seedProducts.length} products into ${database.databaseName}.${COLLECTION_NAME}.`,
    );
    console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(console.error);
