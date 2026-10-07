/**
 * API client used by Server Components during SSR.
 * It calls OUR backend only (never FakeStore) as required by the assignment.
 */
import { API_URL } from './config';
import { PAGE_SIZE, PlpQuery, toSearchParams } from './query';
import type { Category, Product, ProductListResponse } from './types';

/** ApiError: carries the HTTP status so the error boundary / pages can react to it. */
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

/**
 * request: shared fetch wrapper.
 * - `revalidate` caches the response on the Next server for N seconds (fast SSR, still fresh).
 * - non-2xx responses become ApiError with the backend's message (our API always returns { error: { message } }).
 */
async function request<T>(path: string, revalidate: number): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
  } catch {
    throw new ApiError(503, 'The product service is unreachable. Please try again in a moment.');
  }
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try { message = (await res.json())?.error?.message ?? message; } catch { /* body was not JSON */ }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

/** getProducts: one page of products for the current filter state. */
export function getProducts(query: PlpQuery): Promise<ProductListResponse> {
  const params = toSearchParams(query); // same param names as the API
  params.set('page', String(query.page));
  params.set('limit', String(PAGE_SIZE));
  return request<ProductListResponse>(`/products?${params.toString()}`, 60);
}

/** getCategories: categories for the filter sidebar (changes rarely, so cached longer). */
export async function getCategories(): Promise<Category[]> {
  return (await request<{ data: Category[] }>('/categories', 300)).data;
}

/** getProduct: fetches one product by its SEO-friendly slug during server rendering. */
export async function getProduct(slug: string): Promise<Product> {
  const response = await request<{ data: Product }>(`/products/slug/${encodeURIComponent(slug)}`, 60);
  return response.data;
}
