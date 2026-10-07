/**
 * URL <-> filter state.
 * The URL is the single source of truth: server (SSR) and browser both parse it with the SAME
 * function, so a shared link renders exactly what the sender saw, and crawlers can index each state.
 * Query param names intentionally match the backend API's names.
 */
export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest first' },
  { value: 'popular', label: 'Popular' },
  { value: 'price_desc', label: 'Price: High to low' },
  { value: 'price_asc', label: 'Price: Low to high' },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]['value'];

export interface PlpQuery {
  page: number;
  category: string[];
  minPrice?: number;
  maxPrice?: number;
  sort: SortKey;
  q?: string;
  inStock: boolean;
}

/** toNumber: parses a param into a non-negative number, or undefined when missing/invalid (bad URLs must never crash the page). */
function toNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/**
 * parseQuery: URLSearchParams -> typed, sanitised PlpQuery.
 * Anything invalid falls back to a safe default so we never send a request the API would reject with 400.
 */
export function parseQuery(params: URLSearchParams): PlpQuery {
  const sort = params.get('sort');
  const page = Math.floor(toNumber(params.get('page')) ?? 1);
  let minPrice = toNumber(params.get('minPrice'));
  let maxPrice = toNumber(params.get('maxPrice'));
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
  const q = params.get('q')?.trim().slice(0, 100);

  return {
    page: Math.max(1, page),
    category: (params.get('category') ?? '').split(',').map((c) => c.trim().toLowerCase()).filter(Boolean),
    minPrice,
    maxPrice,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : 'recommended',
    q: q || undefined,
    inStock: params.get('inStock') === 'true',
  };
}

/**
 * toSearchParams: PlpQuery -> URLSearchParams in a STABLE order, omitting defaults.
 * Stable order + no defaults = one canonical URL per state (good for SEO canonical tags and caching).
 */
export function toSearchParams(query: PlpQuery): URLSearchParams {
  const p = new URLSearchParams();
  if (query.q) p.set('q', query.q);
  if (query.category.length) p.set('category', query.category.join(','));
  if (query.minPrice !== undefined) p.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) p.set('maxPrice', String(query.maxPrice));
  if (query.inStock) p.set('inStock', 'true');
  if (query.sort !== 'recommended') p.set('sort', query.sort);
  if (query.page > 1) p.set('page', String(query.page));
  return p;
}

/** hasActiveFilters: true when any filter (not sort/page) is applied - decides whether to show "Clear all". */
export function hasActiveFilters(q: PlpQuery): boolean {
  return q.category.length > 0 || q.minPrice !== undefined || q.maxPrice !== undefined || q.inStock || !!q.q;
}

/** hrefFor: builds a link to a given state, e.g. for pagination ("/?category=jewelery&page=2"). */
export function hrefFor(query: PlpQuery): string {
  const qs = toSearchParams(query).toString();
  return qs ? `/?${qs}` : '/';
}
