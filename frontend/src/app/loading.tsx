/**
 * loading.tsx: shown automatically while the page's server data is loading (first visit / hard navigation).
 * Uses the same grid classes as the real page, so there is no layout jump when content arrives.
 */
export default function Loading() {
  return (
    <div className="plp" aria-busy="true" aria-live="polite">
      <div className="hero"><h1>Discover our products</h1></div>
      <div className="plp__layout">
        <div className="filters" aria-hidden="true" />
        <ul className="grid" aria-label="Loading products">
          {Array.from({ length: 12 }, (_, i) => (
            <li key={i}>
              <div className="skeleton skeleton--img" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
