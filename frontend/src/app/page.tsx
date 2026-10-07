import type { Metadata } from 'next';
import { Suspense } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Filters } from '@/components/Filters';
import { FilterToggle } from '@/components/FilterToggle';
import { Pagination } from '@/components/Pagination';
import { ProductCard } from '@/components/ProductCard';
import { SearchForm } from '@/components/SearchForm';
import { SortSelect } from '@/components/SortSelect';
import { getCategories, getProducts } from '@/lib/api';
import { SITE_NAME } from '@/lib/config';
import { hrefFor, PAGE_SIZE, parseQuery } from '@/lib/query';
import { buildJsonLd, serializeJsonLd } from '@/lib/seo';

type SearchParams = Record<string, string | string[] | undefined>;
interface Props { searchParams: Promise<SearchParams> }

const DESCRIPTION = 'Browse our full collection of bags, clothing, jewelery and electronics. Filter by category and price, sort by popularity or price, and search.';

/**
 * toUrlSearchParams: Next gives searchParams as an object (values can be arrays);
 * this converts it to URLSearchParams so the SAME parseQuery works on server and client.
 */
function toUrlSearchParams(raw: SearchParams): URLSearchParams {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string') p.set(key, value);
    else if (Array.isArray(value) && value[0] !== undefined) p.set(key, value[0]);
  }
  return p;
}

/**
 * generateMetadata: runs on the server for each URL. Produces a unique <title>, meta description,
 * canonical URL (normalised params) and Open Graph tags. Page 2+ gets "Page N" so titles stay unique.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = parseQuery(toUrlSearchParams(await searchParams));
  const title = query.page > 1 ? `Discover our products – Page ${query.page}` : 'Discover our products';
  const canonical = hrefFor(query);
  return {
    title,
    description: DESCRIPTION,
    alternates: { canonical },
    openGraph: { title: `${title} | ${SITE_NAME}`, description: DESCRIPTION, url: canonical, siteName: SITE_NAME, type: 'website' },
  };
}

/**
 * ProductsPage (Server Component) - the Product Listing Page.
 * 1. Parse the URL into a typed query.
 * 2. Fetch products + categories IN PARALLEL from our API (SSR: HTML already contains the products).
 * 3. Render hero, toolbar, filters, grid, pagination and JSON-LD.
 * Errors thrown by the API client are caught by app/error.tsx.
 */
export default async function ProductsPage({ searchParams }: Props) {
  const query = parseQuery(toUrlSearchParams(await searchParams));
  const [{ data: products, meta }, categories] = await Promise.all([getProducts(query), getCategories()]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd(products, query, PAGE_SIZE)) }} />

      <section className="hero">
        <h1>Discover our products</h1>
        <p>Bags, clothing, jewelery and electronics picked for you. Use the filters to narrow the list, or search by name.</p>
        <Suspense fallback={<div className="search" aria-hidden="true" />}>
          <SearchForm initialQuery={query.q} />
        </Suspense>
      </section>

      <div className="plp" id="results">
        <div className="toolbar">
          <p className="toolbar__count" aria-live="polite">{meta.total} {meta.total === 1 ? 'item' : 'items'}</p>
          <FilterToggle />
          <SortSelect />
        </div>

        <div className="plp__layout">
          {/* useSearchParams in client components needs a Suspense boundary during static/streamed rendering */}
          <Suspense fallback={<aside className="filters" aria-hidden="true" />}>
            <Filters categories={categories} />
          </Suspense>

          <section aria-labelledby="products-title">
            <h2 id="products-title" className="sr-only">Products</h2>
            {products.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="grid">
                {products.map((product, i) => (
                  <li key={product.id}><ProductCard product={product} priority={i < 4} /></li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <Pagination query={query} totalPages={meta.totalPages} />
      </div>
    </>
  );
}
