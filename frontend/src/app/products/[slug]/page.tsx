import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApiError, getProduct } from '@/lib/api';
import { SITE_NAME, SITE_URL } from '@/lib/config';
import { formatPrice } from '@/lib/format';
import { serializeJsonLd } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

/** loadProduct: turns backend not-found responses into Next's 404 page and surfaces other API failures. */
async function loadProduct(slug: string) {
  try {
    return await getProduct(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

/** Product metadata stays unique and canonical to the product's stable slug URL. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  const description = product.description.slice(0, 160);
  const url = `${SITE_URL}/products/${product.slug}`;
  return {
    title: product.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: product.images[0] ? [{ url: product.images[0].url, alt: product.images[0].alt }] : undefined,
    },
  };
}

/** ProductPage fetches one product server-side and renders its crawlable detail content and Product JSON-LD. */
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  const image = product.images[0];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map((item) => item.url),
    sku: product.slug,
    category: product.category.name,
    url: `${SITE_URL}/products/${product.slug}`,
    aggregateRating: product.rating.count
      ? { '@type': 'AggregateRating', ratingValue: product.rating.rate, reviewCount: product.rating.count }
      : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/products/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Products</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>
      <article className="product-detail">
        <div className="product-detail__media">
          {image && <Image src={image.url} alt={image.alt} width={700} height={875} sizes="(min-width: 768px) 50vw, 100vw" priority />}
        </div>
        <div className="product-detail__content">
          <p className="product-detail__category">{product.category.name}</p>
          <h1>{product.title}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__description">{product.description}</p>
          <p className="product-detail__availability" role="status">
            {product.inStock ? 'In stock' : 'Out of stock'}
          </p>
          {product.rating.count > 0 && (
            <p className="product-detail__rating">
              Rated {product.rating.rate.toFixed(1)} out of 5 from {product.rating.count} reviews
            </p>
          )}
          <Link className="btn" href="/">Continue shopping</Link>
        </div>
      </article>
    </>
  );
}
