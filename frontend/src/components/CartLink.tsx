'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export function CartLink() {
  const { count } = useCart();

  return (
    <Link
      href="/#results"
      className="header__bag"
      aria-label={`Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`}
      title="Shopping bag"
    >
      <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 8h14l-1 12H6L5 8z" />
        <path d="M9 8a3 3 0 016 0" />
      </svg>
      <span className="header__bag-count" aria-hidden="true">{count}</span>
    </Link>
  );
}
