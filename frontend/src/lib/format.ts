const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** formatPrice: 109.95 -> "$109.95". Intl handles separators/rounding correctly. */
export function formatPrice(value: number): string {
  return currency.format(value);
}
