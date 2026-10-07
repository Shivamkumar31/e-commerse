import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { AppError } from '../lib/errors';

/**
 * validate: builds a middleware that checks req.query or req.params against a zod schema.
 * On success the parsed (coerced + defaulted) value is stored in res.locals[source] for the controller.
 * On failure it forwards a 400 AppError with per-field messages.
 * WHY: controllers can trust their input and every endpoint returns the same error shape.
 */
export const validate =
  (source: 'query' | 'params', schema: ZodTypeAny): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
      return next(new AppError(400, 'VALIDATION_ERROR', 'Invalid request parameters', details));
    }
    res.locals[source] = result.data;
    next();
  };
