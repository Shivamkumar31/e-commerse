import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../lib/errors';
import { env } from '../config/env';

/** notFound: runs when no route matched, and turns it into a consistent 404 JSON. */
export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`));
};

/**
 * errorHandler: the ONE place that formats errors. Shape: { error: { statusCode, code, message, details? } }.
 * Unknown errors become a generic 500 so stack traces / DB messages never leak to clients in production.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { statusCode: err.statusCode, code: err.code, message: err.message, details: err.details },
    });
  }
  console.error(err);
  res.status(500).json({
    error: {
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: env.NODE_ENV === 'production' ? 'Something went wrong' : String(err?.message ?? err),
    },
  });
};
