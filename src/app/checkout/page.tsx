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
    <div className="min-h-screen bg-stone-50 py-12">
      <section className="section-padding">
        <CheckoutClient products={products} />
      </section>
    </div>
  );
}