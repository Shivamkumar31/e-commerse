import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { listProductsQuery, productIdParams, productSlugParams } from '../src/modules/products/products.schema';

test('every local image referenced by the seed exists in the deployable image directory', () => {
  const seedPath = path.resolve('prisma/seed.ts');
  const imageDirectory = path.resolve('public/images');
  const seed = readFileSync(seedPath, 'utf8');
  const imagePaths = [...seed.matchAll(/image:\s*"\/images\/([^"]+)"/g)].map((match) => match[1]);

  assert.ok(imagePaths.length > 0, 'seed should reference at least one local image');
  for (const imagePath of imagePaths) {
    assert.ok(existsSync(path.join(imageDirectory, imagePath)), `missing seeded image: ${imagePath}`);
  }
});

test('product list query applies defaults and normalizes categories', () => {
  const result = listProductsQuery.safeParse({
    category: ' Jewelery, electronics ,,',
    page: '2',
    limit: '6',
    inStock: 'true',
  });

  assert.equal(result.success, true);
  if (!result.success) return;
  assert.deepEqual(result.data, {
    page: 2,
    limit: 6,
    category: ['jewelery', 'electronics'],
    sort: 'recommended',
    inStock: true,
  });
});

test('product list query rejects invalid pagination, sort, and price ranges', () => {
  assert.equal(listProductsQuery.safeParse({ page: '0' }).success, false);
  assert.equal(listProductsQuery.safeParse({ limit: '51' }).success, false);
  assert.equal(listProductsQuery.safeParse({ sort: 'unknown' }).success, false);
  assert.equal(listProductsQuery.safeParse({ minPrice: '20', maxPrice: '10' }).success, false);
});

test('product id validation requires a positive integer', () => {
  assert.equal(productIdParams.safeParse({ id: '12' }).success, true);
  assert.equal(productIdParams.safeParse({ id: '0' }).success, false);
  assert.equal(productIdParams.safeParse({ id: '1.5' }).success, false);
});

test('product slug validation accepts URL-safe slugs and rejects malformed values', () => {
  assert.equal(productSlugParams.safeParse({ slug: 'mens-cotton-slim-fit-tshirt' }).success, true);
  assert.equal(productSlugParams.safeParse({ slug: 'bad%2Fslug' }).success, false);
  assert.equal(productSlugParams.safeParse({ slug: 'Uppercase' }).success, false);
});

test('product service builds filters, deterministic sorting, and pagination metadata', async () => {
  process.env.DATABASE_URL ??= 'postgresql://test:test@127.0.0.1:5432/test';
  const { buildWhere, buildOrderBy, buildPageMeta } = await import('../src/modules/products/products.service');
  const query = listProductsQuery.parse({
    page: '3',
    limit: '5',
    category: 'electronics,jewelery',
    minPrice: '10',
    maxPrice: '100',
    q: 'headphones',
    inStock: 'true',
  });

  assert.deepEqual(buildWhere(query), {
    category: { slug: { in: ['electronics', 'jewelery'] } },
    price: { gte: 10, lte: 100 },
    inStock: true,
    OR: [
      { title: { contains: 'headphones', mode: 'insensitive' } },
      { description: { contains: 'headphones', mode: 'insensitive' } },
    ],
  });
  assert.deepEqual(buildOrderBy('price_asc'), [{ price: 'asc' }, { id: 'asc' }]);
  assert.deepEqual(buildOrderBy('newest'), [{ createdAt: 'desc' }, { id: 'desc' }]);
  assert.deepEqual(buildPageMeta(3, 5, 13), { page: 3, limit: 5, total: 13, totalPages: 3 });
});

test('missing product rows become the standard 404 error', async () => {
  process.env.DATABASE_URL ??= 'postgresql://test:test@127.0.0.1:5432/test';
  const { requireProduct } = await import('../src/modules/products/products.service');
  assert.throws(
    () => requireProduct(null, 987),
    (error: unknown) =>
      error instanceof Error &&
      'statusCode' in error &&
      error.statusCode === 404 &&
      'code' in error &&
      error.code === 'PRODUCT_NOT_FOUND',
  );
});

test('API validation and not-found errors use the consistent response envelope', async () => {
  process.env.DATABASE_URL ??= 'postgresql://test:test@127.0.0.1:5432/test';
  const [{ default: express }, { validate }, { errorHandler, notFound }, { AppError }] = await Promise.all([
    import('express'),
    import('../src/middleware/validate'),
    import('../src/middleware/errorHandler'),
    import('../src/lib/errors'),
  ]);
  const app = express();
  app.get('/products', validate('query', listProductsQuery), (_req, res) => res.json(res.locals.query));
  app.get('/known-error', (_req, _res, next) => next(new AppError(404, 'PRODUCT_NOT_FOUND', 'Product 987 not found')));
  app.use(notFound);
  app.use(errorHandler);
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));

  try {
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const baseUrl = `http://127.0.0.1:${address.port}`;
    const invalid = await fetch(`${baseUrl}/products?page=0`);
    assert.equal(invalid.status, 400);
    assert.deepEqual(await invalid.json(), {
      error: {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: [{ field: 'page', message: 'Number must be greater than or equal to 1' }],
      },
    });

    const missing = await fetch(`${baseUrl}/known-error`);
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), {
      error: { statusCode: 404, code: 'PRODUCT_NOT_FOUND', message: 'Product 987 not found' },
    });

    const unknown = await fetch(`${baseUrl}/not-a-route`);
    assert.equal(unknown.status, 404);
    assert.deepEqual(await unknown.json(), {
      error: {
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Route GET /not-a-route not found',
      },
    });
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
