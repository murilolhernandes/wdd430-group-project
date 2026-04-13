'use client'

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart-provider';
import type { Product } from '@/app/lib/products';

type CheckoutState = 'form' | 'processing' | 'success';

export default function CheckoutClient({ products }: { products: Product[] }) {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('form');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const populatedCart = useMemo(() => {
    return cart
      .map((cartItem) => {
        const productDetails = products.find((product) => product.slug === cartItem.productId);
        return {
          ...cartItem,
          product: productDetails
        };
      })
      .filter((item) => item.product !== undefined);
  }, [cart, products]);

  const subtotal = useMemo(() => {
    return populatedCart.reduce((total, item) => {
      return total + item.product!.price * item.quantity;
    }, 0);
  }, [populatedCart]);

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCheckoutState('processing');

    await new Promise((resolve) => {
      setTimeout(resolve, 1200);
    });

    setCheckoutState('success');
  };

  const isPaymentDisabled =
    checkoutState === 'processing' ||
    formData.fullName.trim() === '' ||
    formData.email.trim() === '' ||
    formData.cardNumber.trim() === '' ||
    formData.expiry.trim() === '' ||
    formData.cvv.trim() === '';

  if (checkoutState === 'success') {
    return (
      <div className="min-h-screen bg-stone-50 py-16">
        <section className="section-padding">
          <div className="container-earth max-w-2xl">
            <div className="earth-card p-10 text-center">
              <h1 className="text-4xl font-bold text-stone-800">Payment Successful</h1>
              <p className="mt-4 text-stone-600">
                Thank you for your purchase. Your order is confirmed and we have sent a receipt to your email.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/shop" className="rounded-md bg-stone-800 px-6 py-3 font-medium !text-white hover:!text-white visited:!text-white focus:!text-white transition hover:bg-stone-700">
                  Continue Shopping
                </Link>
                <Link href="/cart" className="rounded-md border border-stone-300 px-6 py-3 font-medium text-stone-700 transition hover:bg-stone-100">
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <section className="section-padding">
        <div className="container-earth grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 border-b border-stone-200 pb-6">
              <h1 className="text-4xl font-bold text-stone-800">Checkout</h1>
              <p className="mt-2 text-stone-600">Enter your payment details to complete your order.</p>
            </div>

            {checkoutState === 'form' && populatedCart.length === 0 ? (
              <div className="earth-card p-8 text-center">
                <h2 className="text-2xl font-semibold text-stone-800">Your cart is empty</h2>
                <p className="mt-3 text-stone-600">Add products before proceeding to checkout.</p>
                <Link href="/shop" className="mt-6 inline-block rounded-md bg-stone-800 px-6 py-3 font-medium text-white transition hover:bg-stone-700">
                  Go to Shop
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="earth-card space-y-5 p-8">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-stone-700">Full Name</span>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
                    className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none ring-offset-2 focus:border-stone-500 focus:ring-2 focus:ring-stone-300"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-stone-700">Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none ring-offset-2 focus:border-stone-500 focus:ring-2 focus:ring-stone-300"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-stone-700">Card Number</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(event) => setFormData((prev) => ({ ...prev, cardNumber: event.target.value }))}
                    className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none ring-offset-2 focus:border-stone-500 focus:ring-2 focus:ring-stone-300"
                    required
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">Expiry</span>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(event) => setFormData((prev) => ({ ...prev, expiry: event.target.value }))}
                      className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none ring-offset-2 focus:border-stone-500 focus:ring-2 focus:ring-stone-300"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">CVV</span>
                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(event) => setFormData((prev) => ({ ...prev, cvv: event.target.value }))}
                      className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none ring-offset-2 focus:border-stone-500 focus:ring-2 focus:ring-stone-300"
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isPaymentDisabled}
                  className="mt-2 w-full rounded-md bg-stone-800 px-6 py-4 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutState === 'processing' ? 'Processing Payment...' : 'Pay Now'}
                </button>
              </form>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="earth-card sticky top-24 p-8">
              <h2 className="text-xl font-semibold text-stone-800">Order Summary</h2>
              <div className="mt-6 space-y-3 border-b border-stone-200 pb-6 text-sm text-stone-600">
                {populatedCart.map((item) => (
                  <div key={item.productId} className="flex items-start justify-between gap-4">
                    <span>{item.product!.name} x{item.quantity}</span>
                    <span className="font-medium text-stone-800">${(item.product!.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-bold text-stone-800">Total</span>
                <span className="text-2xl font-bold text-stone-800">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}