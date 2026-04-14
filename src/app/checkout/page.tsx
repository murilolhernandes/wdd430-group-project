import { getProducts } from "@/app/lib/products";
import CheckoutClient from "./checkout-client";
import { Metadata } from 'next';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Checkout',
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const session = await auth();

  if (!session) {
    redirect('/login?message=You must be logged in to access checkout.');
  }

  const products = await getProducts();

  return (
    <div className="space-y-8 container-earth">
      <section className="section-padding min-h-screen">
        <CheckoutClient products={products} />
      </section>
    </div>
  );
}