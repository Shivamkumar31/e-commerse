/**
 * AppError: an error we throw on purpose (404, 400 ...).
 * WHY: the global error handler can tell "expected" errors (safe to show) from bugs (hide details).
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}
