'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { addToCartDB, syncGuestCartToDB, removeFromCartDB, getCartDB, clearCartDB } from '@/app/lib/actions';

type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (status === 'loading') return;

    const syncCart = async () => {
      const savedCart = localStorage.getItem('guestCart');

      if (status === 'authenticated' && savedCart) {
        const localCartItems = JSON.parse(savedCart);
        if (localCartItems.length > 0) {
          const result = await syncGuestCartToDB(localCartItems);
          if (result?.success && result?.cart) {
            setCart(result.cart);
          }
        }
        localStorage.removeItem('guestCart');
      } else if (status === 'unauthenticated' && savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to parse cart data", error);
        }
      } else if (status === 'authenticated') {
        const result = await getCartDB();
        if (result?.success && result?.cart) {
          setCart(result.cart);
        }
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

  const removeFromCart = async (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);
      if (!existingItem) return prevCart;

      if (existingItem.quantity > 1) {
        return prevCart.map((item) => item.productId === productId ? { ...item, quantity: item.quantity - 1} : item);
      } else {
        return prevCart.filter((item) => item.productId !== productId);
      }
    });

    if (status === 'authenticated') {
      await removeFromCartDB(productId, 1);
    } else {
      const currentCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingItemIndex = currentCart.findIndex((item: CartItem) => item.productId === productId);

      if (existingItemIndex > -1) {
        if (currentCart[existingItemIndex].quantity > 1) {
          currentCart[existingItemIndex].quantity -= 1;
        } else {
          currentCart.splice(existingItemIndex, 1);
        }
        localStorage.setItem('guestCart', JSON.stringify(currentCart));
      }
    }
  };

  const clearCart = async () => {
    setCart([]);

    if (status === 'authenticated') {
      await clearCartDB();
    }

    localStorage.removeItem('guestCart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
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