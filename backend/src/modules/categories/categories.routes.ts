import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { asyncHandler } from '../../lib/asyncHandler';

/**
 * GET /categories: all categories with how many products each has.
 * The frontend uses it to render the Category filter (with counts).
 */
export const categoriesRouter = Router();
categoriesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    res.json({ data: rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, productCount: c._count.products })) });
  }),
);
