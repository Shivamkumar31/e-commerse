/**
 * Products service: ALL database logic lives here (controllers stay thin, easy to test).
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';
import { AppError } from '../../lib/errors';
import type { ListProductsQuery } from './products.schema';

// Relations loaded with every product: its category (name+slug) and images in display order.
const productInclude = {
  category: { select: { name: true, slug: true } },
  images: { orderBy: { position: 'asc' as const } },
} satisfies Prisma.ProductInclude;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

/**
 * toDto: converts a DB row into the public API shape.
 * - Decimal -> number (JSON can't carry Prisma's Decimal)
 * - relative image path -> absolute URL (the frontend lives on another domain)
 */
function toDto(p: ProductRow) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    price: Number(p.price.toString()),
    rating: { rate: p.ratingRate, count: p.ratingCount },
    inStock: p.inStock,
    isNew: p.isNew,
    category: p.category,
    images: p.images.map((img) => ({ id: img.id, url: `${env.PUBLIC_API_URL}${img.url}`, alt: img.alt })),
  };
}

/**
 * buildWhere: translates validated filters (category, price range, stock, search) into a Prisma WHERE.
 * Only filters that were actually sent are added, so the DB does not do useless work.
 */
export function buildWhere(q: ListProductsQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  if (q.category?.length) where.category = { slug: { in: q.category } };
  if (q.minPrice !== undefined || q.maxPrice !== undefined) where.price = { gte: q.minPrice, lte: q.maxPrice };
  if (q.inStock !== undefined) where.inStock = q.inStock;
  if (q.q) {
    where.OR = [
      { title: { contains: q.q, mode: 'insensitive' } },
      { description: { contains: q.q, mode: 'insensitive' } },
    ];
  }
  return where;
}

/**
 * buildOrderBy: maps the public sort key to DB ordering.
 * The final `id` tiebreaker makes order deterministic - otherwise rows with equal values could
 * jump between pages while paginating.
 */
export function buildOrderBy(sort: ListProductsQuery['sort']): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'newest': return [{ createdAt: 'desc' }, { id: 'desc' }];
    case 'popular': return [{ ratingCount: 'desc' }, { id: 'asc' }];
    case 'price_asc': return [{ price: 'asc' }, { id: 'asc' }];
    case 'price_desc': return [{ price: 'desc' }, { id: 'asc' }];
    default: return [{ ratingRate: 'desc' }, { ratingCount: 'desc' }, { id: 'asc' }]; // recommended
  }
}

/**
 * listProducts: returns one page of products + pagination meta.
 * count() and findMany() run in ONE transaction so total and rows match the same snapshot.
 */
export async function listProducts(q: ListProductsQuery) {
  const where = buildWhere(q);
  const [total, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(q.sort),
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      include: productInclude,
    }),
  ]);
  return {
    data: rows.map(toDto),
    meta: buildPageMeta(q.page, q.limit, total),
  };
}

/** buildPageMeta: keeps pagination response metadata consistent for every product listing. */
export function buildPageMeta(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

/** getProductById: one product or a 404 AppError when the id does not exist. */
export async function getProductById(id: number) {
  const row = await prisma.product.findUnique({ where: { id }, include: productInclude });
  return toDto(requireProduct(row, id));
}

/** getProductBySlug: resolves a stable, human-readable product URL or throws the standard 404. */
export async function getProductBySlug(slug: string) {
  const row = await prisma.product.findUnique({ where: { slug }, include: productInclude });
  if (!row) throw new AppError(404, 'PRODUCT_NOT_FOUND', `Product ${slug} not found`);
  return toDto(row);
}

/** requireProduct: converts a missing database row into the API's standard product 404. */
export function requireProduct<T>(row: T | null, id: number): T {
  if (!row) throw new AppError(404, 'PRODUCT_NOT_FOUND', `Product ${id} not found`);
  return row;
}
