import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;

  /**
   * True for the first row.
   * Those images are above the fold, so they load eagerly
   * for better LCP.
   */
  priority: boolean;
}

/**
 * ProductCard (Server Component)
 *
 * One product tile = image + badges + title + price + wishlist heart.
 *
 * next/image provides:
 * - Responsive images
 * - Optimized formats
 * - Lazy loading
 * - Layout stability
 */
export function ProductCard({ product, priority }: Props) {
  const image = product.images[0];

  /**
   * Product images are stored in the backend as paths like:
   *
   * /images/mens-cotton-slim-fit-tshirt.jpg
   *
   * In production, the actual images are served by Render:
   *
   * https://e-commerse-svm1.onrender.com
   *
   * API_URL is available on the server because ProductCard
   * is a Server Component.
   */
  const API_URL =
    process.env.API_URL ?? "http://localhost:4000";

  /**
   * Convert the database image path into a complete backend URL.
   *
   * Example:
   *
   * /images/product.jpg
   *
   * becomes:
   *
   * https://e-commerse-svm1.onrender.com/images/product.jpg
   */
  const imageUrl = image
    ? image.url.startsWith("http")
      ? image.url
      : `${API_URL}${image.url.startsWith("/") ? "" : "/"}${image.url}`
    : null;

  return (
    <article className="card">
      <Link
        href={`/products/${product.slug}`}
        className="card__link"
      >
        <div className="card__media">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={image.alt || product.title}
              width={400}
              height={500}
              sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"
              priority={priority}
            />
          )}

          {product.isNew && (
            <span className="card__tag">
              New product
            </span>
          )}

          {!product.inStock && (
            <span className="card__stock">
              Out of stock
            </span>
          )}
        </div>

        <h3 className="card__title">
          {product.title}
        </h3>
      </Link>

      <div className="card__meta">
        <p className="card__price">
          <span className="sr-only">
            Price:{" "}
          </span>
          {formatPrice(product.price)}
        </p>

        <label className="heart">
          <input
            type="checkbox"
            className="sr-only"
            aria-label={`Add ${product.title} to wishlist (demo only; not saved)`}
          />

          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
            strokeWidth="1.5"
          >
            <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" />
          </svg>
        </label>
      </div>
    </article>
  );
}