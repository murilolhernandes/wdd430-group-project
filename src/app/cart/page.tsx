import { getProducts } from "@/lib/products";
import CartClient from "./cart-client";

export const dynamic = 'force-dynamic'; 

export default async function CartPage() {

  const products = await getProducts();

  return <CartClient products={products} />;
}