import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { openApiDocument } from "./docs/openapi";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { productsRouter } from "./modules/products/products.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";

/**
 * createApp: builds the Express app.
 *
 * The server is started separately in server.ts so the app
 * is easy to test.
 *
 * Middleware order:
 * security -> CORS -> parsers -> static files -> routes
 * -> 404 handler -> error handler
 */
export function createApp() {
  const app = express();

  /**
   * Health check.
   *
   * Render can use this endpoint to verify that the API
   * is running correctly.
   */
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "appscrip-plp-backend",
    });
  });

  /**
   * Helmet adds security headers.
   *
   * crossOriginResourcePolicy: "cross-origin" allows the
   * Vercel frontend to load product images from Render.
   *
   * CSP is disabled because the API does not need a
   * Content-Security-Policy header.
   */
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
      contentSecurityPolicy: false,
    }),
  );

  /**
   * CORS.
   *
   * Only origins listed in CORS_ORIGINS are allowed to
   * make browser requests to the API.
   *
   * Requests without an Origin header (for example,
   * server-to-server requests) are allowed.
   */
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowed =
          !origin || env.corsOrigins.includes(origin);

        callback(null, allowed);
      },
      methods: ["GET", "OPTIONS"],
    }),
  );

  /**
   * JSON request parser.
   */
  app.use(express.json({ limit: "100kb" }));

  /**
   * Product images.
   *
   * Files are stored in:
   *
   * backend/public/images/
   *
   * They are publicly available through:
   *
   * /images/<filename>
   *
   * Example:
   * /images/mens-cotton-slim-fit-tshirt.jpg
   *
   * The long cache lifetime is safe because our image
   * filenames are stable.
   */
  const imagesPath = path.join(
    process.cwd(),
    "public",
    "images",
  );

  app.use(
    "/images",
    express.static(imagesPath, {
      maxAge: "30d",
      immutable: true,
    }),
  );

  /**
   * Swagger API documentation.
   */
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument),
  );

  /**
   * API routes.
   */
  app.use("/products", productsRouter);
  app.use("/categories", categoriesRouter);

  /**
   * 404 handler.
   *
   * Must come after all valid routes.
   */
  app.use(notFound);

  /**
   * Global error handler.
   *
   * Must be the final middleware.
   */
  app.use(errorHandler);

  return app;
}