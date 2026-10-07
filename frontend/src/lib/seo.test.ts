import assert from 'node:assert/strict';
import test from 'node:test';
import { buildJsonLd } from './seo';
import type { Product } from './types';

test('listing structured data links each product to its slug-based detail page', () => {
  const product: Product = {
    id: 7,
    slug: 'mens-cotton-shirt',
    title: "Men's Cotton Shirt",
    description: 'A cotton shirt.',
    price: 19.99,
    rating: { rate: 4.5, count: 10 },
    inStock: true,
    isNew: false,
    category: { name: "Men's Clothing", slug: 'mens-clothing' },
    images: [{ id: 1, url: 'https://api.example.com/images/mens-cotton-shirt.jpg', alt: "Men's cotton shirt" }],
  };
  const jsonLd = buildJsonLd([product], {
    page: 1,
    category: [],
    sort: 'recommended',
    inStock: false,
  }, 12);
  const graph = jsonLd['@graph'] as Array<{ itemListElement?: Array<{ item: { url: string } }> }>;

  assert.equal(graph[0].itemListElement?.[0].item.url.endsWith('/products/mens-cotton-shirt'), true);
});
