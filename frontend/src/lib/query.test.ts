import assert from 'node:assert/strict';
import test from 'node:test';
import { hasActiveFilters, hrefFor, parseQuery, toSearchParams } from './query';

test('query parsing sanitizes invalid values and normalizes the price range', () => {
  const query = parseQuery(new URLSearchParams(
    'page=-5&category=ELECTRONICS%2C+jewelery&minPrice=40&maxPrice=10&sort=invalid&q=%20camera%20&inStock=true',
  ));

  assert.deepEqual(query, {
    page: 1,
    category: ['electronics', 'jewelery'],
    minPrice: 10,
    maxPrice: 40,
    sort: 'recommended',
    q: 'camera',
    inStock: true,
  });
});

test('query serialization omits defaults and produces a stable shareable URL', () => {
  const query = parseQuery(new URLSearchParams('q=shirt&category=clothing&sort=price_asc&page=2'));
  const params = toSearchParams(query);

  assert.equal(params.toString(), 'q=shirt&category=clothing&sort=price_asc&page=2');
  assert.equal(hrefFor(query), '/?q=shirt&category=clothing&sort=price_asc&page=2');
});

test('active filters exclude sort and page alone', () => {
  const query = parseQuery(new URLSearchParams('sort=newest&page=4'));
  assert.equal(hasActiveFilters(query), false);
  assert.equal(hasActiveFilters(parseQuery(new URLSearchParams('category=jewelery'))), true);
});
