import Link from 'next/link';

/** EmptyState: shown when filters/search match nothing. Tells the user what happened and gives one clear action. */
export function EmptyState() {
  return (
    <div className="empty" role="status">
      <h3>No products found</h3>
      <p>Nothing matches your current filters. Remove a filter or try a different search.</p>
      <Link href="/" className="btn">Clear all filters</Link>
    </div>
  );
}
