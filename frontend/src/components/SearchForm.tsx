'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useQueryNavigation } from '@/lib/useQueryNavigation';

/** SearchForm: submits search terms through Next navigation while preserving URL-driven page state. */
export function SearchForm({ initialQuery }: { initialQuery?: string }) {
  const [value, setValue] = useState(initialQuery ?? '');
  const { update } = useQueryNavigation();

  useEffect(() => {
    setValue(initialQuery ?? '');
  }, [initialQuery]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update({ q: value.trim().slice(0, 100) || undefined });
  }

  return (
    <form className="search" role="search" action="/" id="search" onSubmit={submit}>
      <label className="sr-only" htmlFor="q">Search products</label>
      <input
        id="q"
        name="q"
        type="search"
        placeholder="Search products"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={100}
      />
      <button type="submit">Search</button>
    </form>
  );
}
