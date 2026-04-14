'use client';

import React, { useEffect, useState } from 'react';
import { MinusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart-provider';
import type { Product } from '@/app/lib/products';

export default function CartClient({ products }: { products: Product[] }) {
  const { cart, removeFromCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const populatedCart = cart
    .map((cartItem) => {
      const productDetails = products.find(
        (p) => p.slug === cartItem.productId,
      );
      return {
        ...cartItem,
        product: productDetails,
      };
    })
    .filter((item) => item.product !== undefined);

  const subtotal = populatedCart.reduce((total, item) => {
    return total + item.product!.price * item.quantity;
  }, 0);

  return (
    <div className='container-earth space-y-8'>
      <div className='max-w-3xl mx-auto text-center border-b border-stone-200 pb-6'>
        <h1 className='text-4xl font-bold leading-tight text-stone-800'>
          Your Cart
        </h1>
        <p className='mt-2 text-stone-600'>
          {populatedCart.length === 0
            ? 'Your cart is currently empty.'
            : `You have ${populatedCart.length} items in your cart.`}
        </p>
      </div>

      {populatedCart.length === 0 ? (
        <div className='earth-card p-12 text-center'>
          <h2 className='text-2xl font-semibold text-stone-800'>
            Nothing here yet!
          </h2>
          <p className='mt-3 text-stone-600 mb-6'>
            Browse our handcrafted collection to find something you love.
          </p>
          <Link
            href='/shop'
            className='w-full bg-stone-800 !text-white px-6 py-4 rounded-md font-medium hover:bg-stone-700 transition'
          >
            Return to Shop
          </Link>
        </div>
      ) : (
        <div className='grid gap-12 lg:grid-cols-3'>
          <div className='lg:col-span-2 space-y-6'>
            {populatedCart.map((item) => (
              <div
                key={item.productId}
                className='earth-card p-6 flex flex-col sm:flex-row gap-6 items-center'
              >
                <div className='relative w-32 h-32 flex-shrink-0 bg-stone-100 rounded-md overflow-hidden'>
                  <Link
                    href={`/shop/${item.productId}`}
                    className='relative w-32 h-32 flex-shrink-0 bg-stone-100 rounded-md overflow-hidden block transition hover:opacity-80'
                  >
                    {item.product?.imageSrc && (
                      <Image
                        src={item.product.imageSrc}
                        alt={item.product.imageAlt}
                        fill
                        priority
                        className='object-cover'
                      />
                    )}
                  </Link>
                </div>

                <div className='flex-grow text-center sm:text-left'>
                  <Link
                    href={`/shop/${item.productId}`}
                  >
                    <h3 className='text-xl font-semibold text-stone-800 transition hover:text-stone-500 hover:underline'>
                      {item.product?.name}
                    </h3>
                  </Link>
                  <p className='text-sm text-stone-500 mt-1'>
                    By {item.product?.artisan}
                  </p>
                  <p className='mt-3 font-medium text-stone-700'>
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className='flex flex-col items-center sm:items-end text-2xl font-bold text-stone-800'>
                  ${(item.product!.price * item.quantity).toFixed(2)}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className='mt-2 text-stone-500 hover:text-red-500 transition-colors'
                    aria-label='Decrease quantity'
                  >
                    {item.quantity > 1 ? (
                      <MinusCircleIcon className='h-5 w-5' /> // I don't like this icon
                    ) : (
                      <TrashIcon className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='lg:col-span-1'>
            <div className='earth-card p-8 sticky top-24'>
              <h3 className='text-xl font-semibold text-stone-800 mb-6'>
                Order Summary
              </h3>

              <div className='space-y-4 text-stone-600 border-b border-stone-200 pb-6 mb-6'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span className='font-medium text-stone-800'>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping estimate</span>
                  <span className='font-medium text-stone-800'>
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className='flex justify-between items-center mb-8'>
                <span className='text-lg font-bold text-stone-800'>Total</span>
                <span className='text-2xl font-bold text-stone-800'>
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <Link
                href='/checkout'
                className='block w-full text-center bg-stone-800 !text-white px-6 py-4 rounded-md font-medium hover:bg-stone-700 transition'
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
