'use client';

/**
 * error.tsx: Next's error boundary for this route. Shows when the API is down or returns an error.
 * Explains what happened and offers a retry (reset re-renders the route and refetches).
 */
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="empty" role="alert">
      <h1>We couldn't load the products</h1>
      <p>{error.message || 'Something went wrong. Please try again.'}</p>
      <button type="button" className="btn" onClick={reset}>Try again</button>
    </div>
  );
}
