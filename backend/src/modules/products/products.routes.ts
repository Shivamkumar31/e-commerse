import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { validate } from '../../middleware/validate';
import { getOne, getOneBySlug, list } from './products.controller';
import { listProductsQuery, productIdParams, productSlugParams } from './products.schema';

/** Routes: wires URL + validation + controller. Mounted at /products in app.ts. */
export const productsRouter = Router();
productsRouter.get('/', validate('query', listProductsQuery), asyncHandler(list));
productsRouter.get('/slug/:slug', validate('params', productSlugParams), asyncHandler(getOneBySlug));
productsRouter.get('/:id', validate('params', productIdParams), asyncHandler(getOne));
