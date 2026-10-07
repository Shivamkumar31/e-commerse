/**
 * Schema.org JSON-LD builders (structured data for Google rich results).
 */
import { SITE_NAME, SITE_URL } from './config';
import { hrefFor, PlpQuery } from './query';
import type { Product } from './types';

/**
 * buildJsonLd: returns an @graph with
 *  - ItemList of Product entries (one per product on THIS page, positions continue across pages)
 *  - BreadcrumbList (Home > Products)
 * Product URLs point to their server-rendered detail pages.
 */
export function buildJsonLd(products: Product[], query: PlpQuery, pageSize: number) {
  const pageUrl = `${SITE_URL}${hrefFor(query)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#itemlist`,
        name: 'Discover our products',
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: (query.page - 1) * pageSize + i + 1,
          item: {
            '@type': 'Product',
            name: p.title,
            description: p.description,
            image: p.images[0]?.url,
            category: p.category.name,
            url: `${SITE_URL}/products/${p.slug}`,
            aggregateRating: p.rating.count
              ? { '@type': 'AggregateRating', ratingValue: p.rating.rate, reviewCount: p.rating.count }
              : undefined,
            offers: {
              '@type': 'Offer',
              price: p.price.toFixed(2),
              priceCurrency: 'USD',
              availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Products', item: pageUrl },
        ],
      },
    ],
  };
}

/** serializeJsonLd: JSON.stringify + escape "<" so product text can never close the <script> tag (XSS-safe). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
