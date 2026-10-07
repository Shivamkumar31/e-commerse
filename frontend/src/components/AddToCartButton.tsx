'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import type { CartProduct } from '@/lib/cart';

export function AddToCartButton({
  product,
  inStock = true,
  className = 'btn',
}: {
  product: CartProduct;
  inStock?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function add() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button type="button" className={className} onClick={add} disabled={!inStock}>
      {!inStock ? 'Out of stock' : added ? 'Added to bag' : 'Add to bag'}
    </button>
  );
}
