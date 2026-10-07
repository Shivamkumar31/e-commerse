import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ErrorPage from '../app/error';
import Loading from '../app/loading';
import { EmptyState } from './EmptyState';

test('loading state announces busy content and renders product skeletons', () => {
  const html = renderToStaticMarkup(createElement(Loading));
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /aria-label="Loading products"/);
  assert.equal((html.match(/skeleton--img/g) ?? []).length, 12);
});

test('empty state explains the result and offers a clear-filters link', () => {
  const html = renderToStaticMarkup(createElement(EmptyState));
  assert.match(html, /No products found/);
  assert.match(html, /Nothing matches your current filters/);
  assert.match(html, /Clear all filters/);
});

test('error state explains failure and provides a retry action', () => {
  const html = renderToStaticMarkup(createElement(ErrorPage, {
    error: new Error('API unavailable'),
    reset: () => undefined,
  }));
  assert.match(html, /We couldn&#x27;t load the products|We couldn&apos;t load the products/);
  assert.match(html, /API unavailable/);
  assert.match(html, /Try again/);
});
