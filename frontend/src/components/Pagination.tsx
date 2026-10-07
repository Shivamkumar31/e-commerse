import Link from 'next/link';
import { hrefFor, PlpQuery } from '@/lib/query';

/**
 * pageWindow: decides which page numbers to show, e.g. current=5,total=10 -> [1,'…',4,5,6,'…',10].
 * WHY: showing every page would overflow on mobile when there are many pages.
 */
function pageWindow(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

/**
 * Pagination (Server Component). Plain <a> links (via next/link) to ?page=N URLs:
 * crawlers can follow them, they work without JS, and Next still navigates without a full reload.
 */
export function Pagination({ query, totalPages }: { query: PlpQuery; totalPages: number }) {
  if (totalPages <= 1) return null;
  const go = (page: number) => hrefFor({ ...query, page });
  return (
    <nav className="pagination" aria-label="Pagination">
      {query.page > 1 && <Link href={go(query.page - 1)} rel="prev">Previous</Link>}
      <ul>
        {pageWindow(query.page, totalPages).map((p, i) =>
          p === '…' ? (
            <li key={`gap-${i}`} aria-hidden="true">…</li>
          ) : (
            <li key={p}>
              <Link href={go(p)} aria-current={p === query.page ? 'page' : undefined} aria-label={`Page ${p}`}>{p}</Link>
            </li>
          ),
        )}
      </ul>
      {query.page < totalPages && <Link href={go(query.page + 1)} rel="next">Next</Link>}
    </nav>
  );
}
