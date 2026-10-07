'use client';
import { SORT_OPTIONS, SortKey } from '@/lib/query';
import { useQueryNavigation } from '@/lib/useQueryNavigation';

/**
 * SortSelect (Client Component): the "Recommended" dropdown from the design.
 * A native <select> is used on purpose: fully keyboard/screen-reader accessible with no extra library.
 * onChange pushes ?sort=... to the URL; the server re-renders the list.
 */
export function SortSelect() {
  const { query, update } = useQueryNavigation();
  return (
    <div className="toolbar__sort">
      <label htmlFor="sort">Sort by</label>
      <select id="sort" value={query.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
