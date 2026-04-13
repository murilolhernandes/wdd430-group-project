'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { addToCartDB, syncGuestCartToDB } from '@/app/lib/actions';

type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart && status === 'unauthenticated') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(JSON.parse(savedCart));
    }
  }, [status]);

  useEffect(() => {
    const syncCart = async () => {
      const savedCart = localStorage.getItem('guestCart');
      if (status === 'authenticated' && savedCart) {
        const localCartItems = JSON.parse(savedCart);
        if (localCartItems.length > 0) {
          const result = await syncGuestCartToDB(localCartItems);
          if (result.success && result.cart) {
             setCart(result.cart);
          }
        }
        localStorage.removeItem('guestCart');
      } else if (status === 'authenticated') {
         // Optionally: Fetch the user's cart from DB here if localStorage was empty
         // to populate the initial state for logged-in users.
      }
    };
    syncCart();
  }, [status]);

  const addToCart = async (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { productId, quantity }];
    });

    if (status === 'authenticated') {
      await addToCartDB(productId, quantity);
    } else {
      const currentCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingItemIndex = currentCart.findIndex((item: CartItem) => item.productId === productId);
      
      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        currentCart.push({ productId, quantity });
      }
      localStorage.setItem('guestCart', JSON.stringify(currentCart));
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};