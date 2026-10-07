'use client';
import Link from 'next/link';
import { FormEvent } from 'react';
import { hasActiveFilters } from '@/lib/query';
import { useQueryNavigation } from '@/lib/useQueryNavigation';
import type { Category } from '@/lib/types';

/** parsePrice: "" -> undefined, "12.5" -> 12.5, invalid/negative -> undefined. */
function parsePrice(value: FormDataEntryValue | null): number | undefined {
  const n = Number(value);
  return value !== null && String(value).trim() !== '' && Number.isFinite(n) && n >= 0 ? n : undefined;
}

/**
 * Filters (Client Component): sidebar accordion from the design - Category, Price, Availability.
 * Each <details> is a native accordion (keyboard accessible, no JS needed to open/close).
 * Every change calls update() which writes to the URL; there is no separate filter state.
 */
export function Filters({ categories }: { categories: Category[] }) {
  const { query, update } = useQueryNavigation();

  /** toggleCategory: adds the slug if absent, removes it if present (multi-select). */
  function toggleCategory(slug: string) {
    const next = query.category.includes(slug) ? query.category.filter((c) => c !== slug) : [...query.category, slug];
    update({ category: next });
  }

  /** applyPrice: reads the min/max form fields and pushes them to the URL (swaps them if min > max). */
  function applyPrice(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let min = parsePrice(data.get('min'));
    let max = parsePrice(data.get('max'));
    if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
    update({ minPrice: min, maxPrice: max });
  }

  const categorySummary = query.category.length ? `${query.category.length} selected` : 'All';
  const priceSummary = query.minPrice !== undefined || query.maxPrice !== undefined ? 'Custom' : 'All';

  return (
    <aside className="filters" id="filters" aria-labelledby="filters-title">
      <h2 id="filters-title" className="sr-only">Filters</h2>

      <details className="filter" open>
        <summary>Category<small>{categorySummary}</small></summary>
        <ul>
          {categories.map((c) => (
            <li key={c.id}>
              <label>
                <input type="checkbox" checked={query.category.includes(c.slug)} onChange={() => toggleCategory(c.slug)} />
                {c.name} <span className="filter__count">({c.productCount})</span>
              </label>
            </li>
          ))}
        </ul>
      </details>

      <details className="filter" open>
        <summary>Price<small>{priceSummary}</small></summary>
        {/* key resets the uncontrolled inputs whenever the URL values change (e.g. after "Clear all") */}
        <form className="filter__price" onSubmit={applyPrice} key={`${query.minPrice}-${query.maxPrice}`}>
          <label>Min <input name="min" type="number" min="0" step="1" inputMode="decimal" defaultValue={query.minPrice ?? ''} /></label>
          <label>Max <input name="max" type="number" min="0" step="1" inputMode="decimal" defaultValue={query.maxPrice ?? ''} /></label>
          <button type="submit">Apply</button>
        </form>
      </details>

      <details className="filter" open>
        <summary>Availability<small>{query.inStock ? 'In stock' : 'All'}</small></summary>
        <ul>
          <li>
            <label>
              <input type="checkbox" checked={query.inStock} onChange={(e) => update({ inStock: e.target.checked })} />
              In stock only
            </label>
          </li>
        </ul>
      </details>

      {hasActiveFilters(query) && <Link href="/" className="filters__clear">Clear all</Link>}
    </aside>
  );
}
