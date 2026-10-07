import type { Request, Response } from 'express';
import { getProductById, getProductBySlug, listProducts } from './products.service';
import type { ListProductsQuery } from './products.schema';

/** list: handles GET /products. Reads the already-validated query from res.locals and returns { data, meta }. */
export async function list(_req: Request, res: Response) {
  res.json(await listProducts(res.locals.query as ListProductsQuery));
}

/** getOne: handles GET /products/:id. Service throws 404 if missing, errorHandler formats it. */
export async function getOne(_req: Request, res: Response) {
  const { id } = res.locals.params as { id: number };
  res.json({ data: await getProductById(id) });
}

/** getOneBySlug: serves SEO-friendly product detail URLs. */
export async function getOneBySlug(_req: Request, res: Response) {
  const { slug } = res.locals.params as { slug: string };
  res.json({ data: await getProductBySlug(slug) });
}
