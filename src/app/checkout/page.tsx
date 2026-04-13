import { getProducts } from "@/app/lib/products";
import CheckoutClient from "./checkout-client";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const products = await getProducts();

  return <CheckoutClient products={products} />;
}