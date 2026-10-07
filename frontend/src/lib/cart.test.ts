import assert from 'node:assert/strict';
import test from 'node:test';
import { addItemToCart, getCartCount } from './cart';

const product = { id: 7, slug: 'canvas-tote', title: 'Canvas Tote', price: 24 };

test('adding an item creates a cart line and increments its quantity on repeat adds', () => {
  const once = addItemToCart([], product);
  const twice = addItemToCart(once, product);

  assert.equal(once[0].quantity, 1);
  assert.equal(twice.length, 1);
  assert.equal(twice[0].quantity, 2);
  assert.equal(getCartCount(twice), 2);
});
