import dbConnect from "@/app/lib/mongodb";
import { Product as ProductModel } from "@/app/lib/models/Product"

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

type RawProductDoc = Product & {
  _id?: unknown;
  __v?: number;
}

function toProduct(doc: RawProductDoc): Product {
  return {
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    artisan: doc.artisan,
    material: doc.material,
    price: doc.price,
    stock: doc.stock,
    shippingEstimate: doc.shippingEstimate,
    imageSrc: doc.imageSrc,
    imageAlt: doc.imageAlt,
    description: doc.description,
    featured: doc.featured,
  };
}

export async function getProducts(): Promise<Product[]> {
  await dbConnect();

  const products = await ProductModel.find({})
    .sort({ featured: -1, name: 1 })
    .lean() as RawProductDoc[];

  return products.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await dbConnect();

  const product = await ProductModel.findOne({ slug })
    .lean() as RawProductDoc | null;

  return product ? toProduct(product) : null;
}


