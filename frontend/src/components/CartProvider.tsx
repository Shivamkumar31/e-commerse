'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { addItemToCart, getCartCount, type CartItem, type CartProduct } from '@/lib/cart';

interface CartContextValue {
  count: number;
  addItem: (product: CartProduct) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const value = useMemo(
    () => ({
      count: getCartCount(items),
      addItem: (product: CartProduct) => setItems((current) => addItemToCart(current, product)),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
