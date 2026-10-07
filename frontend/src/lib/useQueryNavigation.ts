'use client';
/**
 * useQueryNavigation: the client-side hook every interactive filter uses.
 * It reads the current URL state and exposes update(patch) which pushes a new URL.
 * Next then re-renders the Server Component with the new params and fetches only the new data (no full reload).
 */
import { useCallback, useEffect, useMemo, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { parseQuery, PlpQuery, toSearchParams } from './query';

export function useQueryNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Current filter state, derived from the URL (never duplicated in React state -> cannot go out of sync).
  const query = useMemo(() => parseQuery(new URLSearchParams(searchParams.toString())), [searchParams]);

  // While the new page is loading, mark the results region busy (CSS dims it; screen readers get aria-busy).
  useEffect(() => {
    if (!isPending) return;
    const el = document.getElementById('results');
    el?.setAttribute('aria-busy', 'true');
    return () => el?.setAttribute('aria-busy', 'false');
  }, [isPending]);

  /**
   * update: merge `patch` into the current state and navigate.
   * Changing any filter/sort resets to page 1 (unless the patch sets page explicitly),
   * otherwise you could land on an empty page 5 of a smaller result set.
   */
  const update = useCallback(
    (patch: Partial<PlpQuery>) => {
      const next: PlpQuery = { ...query, page: 1, ...patch };
      const qs = toSearchParams(next).toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [query, pathname, router],
  );

  return { query, update, isPending };
}
