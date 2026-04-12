import { getProducts } from "@/lib/products";
import CheckoutClient from "./checkout-client";

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const products = await getProducts();

  return <CheckoutClient products={products} />;
}
