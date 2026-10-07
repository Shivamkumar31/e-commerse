/** Types mirroring the backend's JSON responses. Keeping them in one file makes API changes easy to follow. */
export interface ProductImage { id: number; url: string; alt: string }

export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  rating: { rate: number; count: number };
  inStock: boolean;
  isNew: boolean;
  category: { name: string; slug: string };
  images: ProductImage[];
}

export interface Category { id: number; name: string; slug: string; productCount: number }
export interface PageMeta { page: number; limit: number; total: number; totalPages: number }
export interface ProductListResponse { data: Product[]; meta: PageMeta }
