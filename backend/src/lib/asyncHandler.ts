import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * asyncHandler: wraps an async route so a rejected promise reaches Express' error middleware.
 * WHY: Express 4 does not catch errors from async functions by itself; without this the request would hang.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
