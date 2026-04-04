import type { WithId } from "mongodb";

import { getDatabase } from "@/lib/mongodb";

export type Product = {
  slug: string;
  name: string;
  category: string;
  artisan: string;
  material: string;
  price: number;
  stock: number;
  shippingEstimate: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  featured: boolean;
};

const COLLECTION_NAME = "products";

function toProduct(product: WithId<Product>): Product {
  const { _id, ...rest } = product;
  void _id;

  return rest;
}

async function getProductsCollection() {
  const database = await getDatabase();
  return database.collection<Product>(COLLECTION_NAME);
}

export async function getProducts() {
  const collection = await getProductsCollection();
  const products = await collection
    .find({})
    .sort({ featured: -1, name: 1 })
    .toArray();

  return products.map(toProduct);
}

export async function getProductBySlug(slug: string) {
  const collection = await getProductsCollection();
  const product = await collection.findOne({ slug });

  return product ? toProduct(product) : null;
}


