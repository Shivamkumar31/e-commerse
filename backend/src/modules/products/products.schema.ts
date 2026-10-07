import { z } from 'zod';

export const SORT_VALUES = ['recommended', 'newest', 'popular', 'price_asc', 'price_desc'] as const;

/** csv: turns "a,b" into ["a","b"] (lowercased, trimmed) so ?category=a,b selects several categories. */
const csv = z.string().transform((s) => s.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean));

/**
 * listProductsQuery: schema (DTO) for GET /products.
 * z.coerce converts query-string text into numbers; defaults give the API sensible behaviour with no params.
 * The refine() makes sure minPrice is not greater than maxPrice.
 */
export const listProductsQuery = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    category: csv.optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sort: z.enum(SORT_VALUES).default('recommended'),
    q: z.string().trim().min(1).max(100).optional(),
    inStock: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  })
  .refine((d) => d.minPrice === undefined || d.maxPrice === undefined || d.minPrice <= d.maxPrice, {
    message: 'minPrice must be less than or equal to maxPrice',
    path: ['minPrice'],
  });

/** productIdParams: validates the :id in GET /products/:id (must be a positive integer). */
export const productIdParams = z.object({ id: z.coerce.number().int().positive() });
export const productSlugParams = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export type ListProductsQuery = z.infer<typeof listProductsQuery>;
