import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { openApiDocument } from './docs/openapi';
import { errorHandler, notFound } from './middleware/errorHandler';
import { productsRouter } from './modules/products/products.routes';
import { categoriesRouter } from './modules/categories/categories.routes';

/**
 * createApp: builds the Express app (no listen here, so it is easy to test).
 * Order matters: security -> parsers -> static -> routes -> 404 -> error handler.
 */
export function createApp() {
  const app = express();

  // helmet adds security headers. cross-origin resource policy is relaxed so the frontend domain can load our images.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }));

  // CORS: only origins listed in CORS_ORIGINS may call the API from a browser (server-to-server calls have no origin and pass).
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || env.corsOrigins.includes(origin)),
      methods: ['GET', 'OPTIONS'],
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  // Product images with long cache headers (file names are stable and SEO-friendly).
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images'), { maxAge: '30d', immutable: true }));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use('/products', productsRouter);
  app.use('/categories', categoriesRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
