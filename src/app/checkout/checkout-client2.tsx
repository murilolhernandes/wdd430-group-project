'use client'

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart-provider';
import type { Product } from '@/app/lib/products';

type CheckoutState = 'form' | 'processing' | 'success';

export default function CheckoutClient({ products }: { products: Product[] }) {
  const { cart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('form');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expirationDate: '',
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const limitedValue = value.substring(0, 16);
    const formattedValue = limitedValue.replace(/(.{4})/g, '$1 ').trim();
    setFormData(prev => ({ ...prev, cardNumber: formattedValue }));
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const limitedValue = value.substring(0, 4);
    let formattedValue = limitedValue;
    if (limitedValue.length >= 3) {
      formattedValue = `${limitedValue.substring(0, 2)}/${limitedValue.substring(2)}`;
    }
    setFormData(prev => ({ ...prev, expirationDate: formattedValue }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const limitedValue = value.substring(0, 3);
    setFormData(prev => ({ ...prev, cvv: limitedValue }));
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const limitedValue = value.substring(0, 5);
    setFormData(prev => ({ ...prev, zip: limitedValue }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCheckoutState('processing');

    // Fake API to simulate the processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await clearCart();

    setCheckoutState('success');
  };

  const isPaymentDisabled =
    checkoutState === 'processing' ||
    Object.values(formData).some(val => val.trim() === '') ||
    formData.fullName.trim() === '' ||
    formData.email.trim() === '' ||
    formData.cardNumber.replace(/\s/g, '').length !== 16 ||
    formData.expirationDate.length !== 5 ||
    formData.cvv.length !== 3 ||
    formData.zip.length !== 5;

  if (checkoutState === 'success') {
    return (
      <div className="min-h-screen bg-stone-50 py-16">
        <section className="section-padding">
          <div className="container-earth max-w-2xl">
            <div className="earth-card p-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-stone-800">Payment Successful!</h1>
              <p className="mt-4 text-stone-600">
                Thank you for your purchase. Your order has been confirmed and your cart has been emptied. A receipt has been sent to your email.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/shop" className="rounded-md bg-stone-800 px-6 py-3 font-medium !text-white transition hover:bg-stone-700">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container-earth space-y-8">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center border-b border-stone-200 pb-6">
        <h1 className="text-4xl font-bold leading-tight text-stone-800">Checkout</h1>
        <p className="mt-2 text-stone-600">Enter your details to finalize your handcrafted pieces.</p>
      </div>

      {checkoutState === 'form' && populatedCart.length === 0 ? (
        <div className="earth-card p-8 text-center">
          <h2 className="text-2xl font-semibold text-stone-800">Your cart is empty</h2>
          <p className="mt-3 text-stone-600">Add products before proceeding to checkout.</p>
          <Link href="/shop" className="mt-6 inline-block rounded-md bg-stone-800 px-6 py-3 font-medium !text-white transition hover:bg-stone-700">
            Return to Shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-3 lg:items-start">
          
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="earth-card p-8 space-y-5">
                <h2 className="text-xl font-bold text-stone-800 border-b border-stone-200 pb-3 mb-5">1. Contact Information</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">Full Name</span>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">Email Address</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="earth-card p-8 space-y-5">
                <h2 className="text-xl font-bold text-stone-800 border-b border-stone-200 pb-3 mb-5">2. Billing Address</h2>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-stone-700">Street Address</span>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                    required
                  />
                </label>
                <div className="grid gap-5 md:grid-cols-3">
                  <label className="block md:col-span-1">
                    <span className="mb-2 block text-sm font-medium text-stone-700">City</span>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                      required
                    />
                  </label>
                  <label className="block md:col-span-1">
                    <span className="mb-2 block text-sm font-medium text-stone-700">State</span>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                      className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                      required
                    />
                  </label>
                  <label className="block md:col-span-1">
                    <span className="mb-2 block text-sm font-medium text-stone-700">ZIP Code</span>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={handleZipChange}
                      placeholder="12345"
                      className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="earth-card p-8 space-y-5">
                <h2 className="text-xl font-bold text-stone-800 border-b border-stone-200 pb-3 mb-5">3. Payment Details</h2>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-stone-700">Card Number</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none tracking-widest focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                    required
                  />
                </label>
                <div className="grid grid-cols-2 gap-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">Expiration Date</span>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expirationDate}
                      onChange={handleExpirationChange}
                      className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-stone-700">Security Code (CVV)</span>
                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleCvvChange}
                      className="w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none tracking-widest focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                      required
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isPaymentDisabled}
                  className="mt-6 w-full rounded-md bg-stone-800 px-6 py-4 font-bold text-white uppercase tracking-wider transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {checkoutState === 'processing' ? 'Processing Secure Payment...' : `Pay $${subtotal.toFixed(2)}`}
                </button>
                <p className="text-center text-xs text-stone-400 mt-3">
                  Your payment information is completely safe and securely processed.
                </p>
              </div>
            </form>
          </div>

          <aside className="lg:col-span-1">
            <div className="earth-card sticky top-24 p-8">
              <h2 className="text-xl font-bold text-stone-800 border-b border-stone-200 pb-3">Order Summary</h2>
              <div className="mt-6 space-y-4 border-b border-stone-200 pb-6 text-sm text-stone-600">
                {populatedCart.map((item) => (
                  <div key={item.productId} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-stone-800">{item.product!.name}</p>
                      <p className="text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-stone-800">${(item.product!.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 text-sm text-stone-600 border-b border-stone-200 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-bold text-stone-800">Total</span>
                <span className="text-2xl font-bold text-stone-800">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>

        </div>
      )}
    </div>
  );
}