# Appscrip-task-Shivam – Product Listing Page (PLP)

A full-stack e-commerce Product Listing Page (PLP) built as part of the Appscrip Full-Stack Engineer assignment.

The application includes:

- Server-rendered Next.js frontend
- Express + TypeScript REST API
- PostgreSQL database hosted on Neon
- Prisma ORM with migrations
- Dockerized backend deployed on Render
- Next.js frontend deployed on Vercel
- Product filtering, sorting, search and pagination
- Responsive product grid
- SEO metadata and structured data
- Swagger API documentation
- Optimized product images using `next/image`

---

## 1. Live Links

### Frontend

https://e-commerse-blond.vercel.app/

### Backend API

https://e-commerse-svm1.onrender.com/

### Swagger API Documentation

https://e-commerse-svm1.onrender.com/docs

### Health Check

https://e-commerse-svm1.onrender.com/health

### GitHub Repository

https://github.com/Shivamkumar31/e-commerse

---

## 2. Deployment Architecture

```text
                         USERS
                           |
                           v
              +-------------------------+
              |        Vercel           |
              |   Next.js Frontend      |
              |   App Router + SSR      |
              +------------+------------+
                           |
                           | HTTPS REST API
                           v
              +-------------------------+
              |        Render           |
              |   Docker Web Service    |
              | Express + TypeScript    |
              +------------+------------+
                           |
                           | Prisma
                           v
              +-------------------------+
              |         Neon            |
              |      PostgreSQL         |
              +-------------------------+
```

Product images are packaged inside the backend Docker image:

```text
backend/public/images/
        |
        v
Render API
/images/<filename>.jpg
        |
        v
Next.js next/image
```

---

## 3. Tech Stack and Why

| Part | Choice | Why |
|------|--------|-----|
| Frontend | Next.js App Router + TypeScript | Server-side rendering, Server Components, routing, metadata and image optimization |
| Backend | Node.js + Express + TypeScript | Lightweight REST API with clear middleware and route structure |
| Database | PostgreSQL | Relational database suitable for products, categories and product images |
| Database hosting | Neon PostgreSQL | Managed PostgreSQL database suitable for production deployment |
| ORM | Prisma | Type-safe database queries, migrations and schema management |
| Validation | Zod | Request validation, coercion, defaults and typed validation output |
| Styling | Plain CSS | Lightweight styling without a UI framework |
| API documentation | Swagger / OpenAPI | Interactive API documentation |
| Containerization | Docker | Reproducible production backend environment |
| Frontend deployment | Vercel | Native Next.js deployment and CDN |
| Backend deployment | Render | Docker-based web service deployment |

---

## 4. Features

### Product Listing

- Product grid
- Product cards
- Product images
- Product title
- Product price
- New product badge
- Out-of-stock badge
- Wishlist visual interaction

### Search

Search products using the `q` query parameter.

Example:

```text
/products?q=shirt
```

### Filtering

Supported filters:

- Category
- Minimum price
- Maximum price
- Availability

Example:

```text
/products?category=mens-clothing
```

### Sorting

Supported sorting options:

- `recommended`
- `newest`
- `popular`
- `price_asc`
- `price_desc`

Example:

```text
/products?sort=price_asc
```

### Pagination

Products support server-side pagination.

Example:

```text
/products?page=2&limit=12
```

### Product Details

Products can be opened using their slug:

```text
/products/<slug>
```

### Responsive UI

The layout is designed for:

- Desktop
- Tablet
- Mobile

The page avoids horizontal overflow and adapts the product grid to the viewport.

---

## 5. Local Development

### Prerequisites

Install:

- Node.js 20+
- npm
- Docker
- PostgreSQL

### Step 1 — Clone the repository

```bash
git clone https://github.com/Shivamkumar31/e-commerse.git
cd e-commerse
```

---

## 6. Run PostgreSQL Locally

Docker can be used for local PostgreSQL:

```bash
docker run --name plp-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=plp \
  -p 5432:5432 \
  -d postgres:16
```

The local database connection string is:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/plp?schema=public
```

---

## 7. Backend Setup

Open a terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm ci
```

Create the environment file:

```bash
cp .env.example .env
```

Configure `.env`:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/plp?schema=public

CORS_ORIGINS=http://localhost:3000

PUBLIC_API_URL=http://localhost:4000
```

### Prisma Migration

Apply the database migrations:

```bash
npx prisma migrate deploy
```

For development migrations:

```bash
npm run migrate:dev
```

### Seed the Database

Load the curated product catalog:

```bash
npm run seed
```

The seed creates:

- Categories
- Products
- Product images

Product images are stored in:

```text
backend/public/images/
```

The seed references these local image files.

### Backend Tests

Run:

```bash
npm test
```

### Type Checking

```bash
npm run typecheck
```

### Production Build

```bash
npm run build
```

### Run Backend

```bash
npm run dev
```

The local API is available at:

```text
http://localhost:4000
```

Swagger:

```text
http://localhost:4000/docs
```

Health:

```text
http://localhost:4000/health
```

---

## 8. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm ci
```

Create the environment file:

```bash
cp .env.example .env.local
```

Configure:

```env
API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Frontend Tests

```bash
npm test
```

### Type Checking

```bash
npm run typecheck
```

### Production Build

```bash
npm run build
```

### Run Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 9. Architecture and Folder Structure

```text
e-commerse/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── public/
│   │   └── images/
│   │       ├── mens-cotton-slim-fit-tshirt.jpg
│   │       ├── mens-casual-jacket.jpg
│   │       ├── mens-premium-hoodie.jpg
│   │       └── ...
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   ├── AppError.ts
│   │   │   └── asyncHandler.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── validate.ts
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── modules/
│   │   │   ├── products/
│   │   │   │   ├── products.schema.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   ├── products.controller.ts
│   │   │   │   └── products.routes.ts
│   │   │   │
│   │   │   └── categories/
│   │   │       ├── categories.service.ts
│   │   │       ├── categories.controller.ts
│   │   │       └── categories.routes.ts
│   │   │
│   │   ├── docs/
│   │   │   └── openapi.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   └── products/
│   │   │       └── [slug]/
│   │   │
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── SearchForm.tsx
│   │   │   ├── Filters.tsx
│   │   │   ├── SortSelect.tsx
│   │   │   ├── FilterToggle.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   └── lib/
│   │       ├── api.ts
│   │       ├── query.ts
│   │       ├── seo.ts
│   │       ├── config.ts
│   │       ├── format.ts
│   │       └── useQueryNavigation.ts
│   │
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── static-html/
│   └── index.html
│
└── README.md
```

---

## 10. Request Flow

```text
Browser
   |
   v
Next.js Server Component
   |
   | GET /products
   v
Express REST API
   |
   v
Validation
   |
   v
Products Controller
   |
   v
Products Service
   |
   v
Prisma
   |
   v
Neon PostgreSQL
```

The initial product listing is server-rendered by Next.js.

Search, filtering and sorting update URL query parameters. Next.js then re-renders the server component using the updated URL state.

---

## 11. API Endpoints

Full API documentation:

https://e-commerse-svm1.onrender.com/docs

### Products

```text
GET /products
```

Supported query parameters:

- `page`
- `limit`
- `category`
- `minPrice`
- `maxPrice`
- `sort`
- `q`
- `inStock`

Example:

```text
/products?page=1&limit=12&sort=price_asc
```

Supported sort values:

- `recommended`
- `newest`
- `popular`
- `price_asc`
- `price_desc`

Category values can be comma-separated.

Example:

```text
/products?category=mens-clothing,womens-clothing
```

### Product by ID

```text
GET /products/:id
```

### Product by Slug

```text
GET /products/slug/:slug
```

### Categories

```text
GET /categories
```

### Health

```text
GET /health
```

### Product Images

```text
/images/<filename>
```

Example:

```text
/images/mens-cotton-slim-fit-tshirt.jpg
```

---

## 12. API Response Format

Successful product responses use:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 60,
    "totalPages": 5
  }
}
```

Errors use a consistent structure:

```json
{
  "error": {
    "statusCode": 400,
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": {}
  }
}
```

Error categories include:

- 400 validation errors
- 404 not found
- 500 internal server errors

---

## 13. SSR and SEO Decisions

### Server-Side Rendering

`app/page.tsx` is an asynchronous Server Component.

Products are fetched on the server before the page is sent to the browser.

This means product content is available in the initial HTML.

### URL-Based State

Search, filters, sorting and pagination are represented in URL query parameters.

Example:

```text
/?category=jewelery&sort=price_asc&page=2
```

This makes filtered states:

- Shareable
- Bookmarkable
- Crawlable

### Metadata

The application generates:

- Unique page titles
- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Product metadata

### Semantic HTML

The application uses:

- `header`
- `nav`
- `main`
- `aside`
- `section`
- `article`
- `footer`

Heading hierarchy:

- H1 → page title
- H2 → sections
- H3 → product titles

### Structured Data

The application includes JSON-LD for:

- ItemList
- Product
- Offer
- Rating
- BreadcrumbList

Product detail pages also contain Product/Offer structured data.

### Images

Images use `next/image`.

Features include:

- Responsive image sizes
- AVIF/WebP optimization
- Lazy loading
- Eager loading for above-the-fold products
- Descriptive filenames
- Meaningful alt text

Product images are served by the Render backend from:

```text
backend/public/images/
```

---

## 14. Docker Backend Deployment

The backend is containerized using Docker.

### Dockerfile

The backend Docker image:

1. Uses Node.js 20
2. Installs OpenSSL for Prisma
3. Installs npm dependencies
4. Copies Prisma schema
5. Generates Prisma Client
6. Copies TypeScript source
7. Copies product images
8. Builds the TypeScript application
9. Starts the production server

The important image step is:

```dockerfile
COPY public ./public
```

This ensures the product images are included in the production Docker image.

### Backend Docker Build

From the backend directory:

```bash
docker build -t appscrip-backend .
```

Run locally:

```bash
docker run --rm \
  -p 4000:4000 \
  -e PORT=4000 \
  -e NODE_ENV=development \
  -e DATABASE_URL="YOUR_DATABASE_URL" \
  -e CORS_ORIGINS="http://localhost:3000" \
  -e PUBLIC_API_URL="http://localhost:4000" \
  appscrip-backend
```

---

## 15. Production Deployment

### Database — Neon PostgreSQL

A managed PostgreSQL database is hosted on Neon.

The production backend receives the database connection through:

```env
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

The database credentials are stored as Render environment variables and are not committed to GitHub.

Prisma migrations are maintained under:

```text
backend/prisma/migrations/
```

### Backend — Render

The backend is deployed as a Docker Web Service on Render.

Render configuration:

| Setting | Value |
|---------|-------|
| Repository | `Shivamkumar31/e-commerse` |
| Branch | `main` |
| Root Directory | `backend` |
| Environment | Docker |

Production environment variables:

```env
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
NODE_ENV=production
CORS_ORIGINS=https://e-commerse-blond.vercel.app
PUBLIC_API_URL=https://e-commerse-svm1.onrender.com
```

The production server uses:

```bash
node dist/server.js
```

Render supplies the production `PORT` automatically.

The server binds to:

```text
0.0.0.0
```

### Frontend — Vercel

The frontend is deployed on Vercel.

Configuration:

| Setting | Value |
|---------|-------|
| Repository | `Shivamkumar31/e-commerse` |
| Root Directory | `frontend` |
| Framework | Next.js |

Production environment variables:

```env
API_URL=https://e-commerse-svm1.onrender.com
NEXT_PUBLIC_SITE_URL=https://e-commerse-blond.vercel.app
```

---

## 16. Deployment Verification

After deployment, verify the following endpoints.

### Backend health

https://e-commerse-svm1.onrender.com/health

Expected:

```json
{
  "status": "ok",
  "service": "appscrip-plp-backend"
}
```

### Products

https://e-commerse-svm1.onrender.com/products?limit=2

### Product by slug

https://e-commerse-svm1.onrender.com/products/slug/mens-cotton-slim-fit-tshirt

### Product image

https://e-commerse-svm1.onrender.com/images/mens-cotton-slim-fit-tshirt.jpg

### Swagger

https://e-commerse-svm1.onrender.com/docs

### Frontend

https://e-commerse-blond.vercel.app/

---

## 17. Static HTML Prototype

The first stage of the assignment was implemented separately in:

```text
static-html/index.html
```

It can be opened directly in a browser.

The prototype uses the shared CSS and references local seeded product images.

The controls in this prototype are intentionally static because this stage demonstrates the HTML/CSS implementation before the React/Next.js application.

---

## 18. Dependencies and Why

### Frontend

| Package | Used for |
|---------|----------|
| `next` | App Router, Server Components, SSR, Routing, Metadata, Image optimization |
| `react` / `react-dom` | The React UI |
| `TypeScript` | Type safety |
| `tsx` | TypeScript-based tests |
| `next/image` | Optimized responsive product images |
| `next/font` | Optimized font loading |

No UI framework or CSS framework is used.

### Backend

| Package | Used for |
|---------|----------|
| `express` | HTTP server and REST API |
| `cors` | Controls browser cross-origin API access |
| `helmet` | Adds security-related HTTP headers |
| `zod` | Validates and parses API query parameters |
| `dotenv` | Loads environment variables during local development |
| `prisma` / `@prisma/client` | Database ORM, migrations and type-safe database access |
| `swagger-ui-express` | Interactive API documentation |
| `typescript` | Static typing for backend code |
| `tsx` | Development, seeding and tests |

---

## 19. AI Usage

AI tools were used during development for:

- Project scaffolding
- Boilerplate generation
- Code comments
- Folder structure suggestions
- Zod schema generation
- Prisma query building
- CSS implementation based on the provided design
- Debugging and deployment troubleshooting

AI tools used included Claude and ChatGPT.

### Example of correcting/rejecting AI output

One example was the initial product image/seed approach. The generated seed used placeholder SVG images, but these did not match the desired e-commerce product presentation. I replaced that approach with a curated set of local JPG product images and updated the Prisma seed to reference those actual files from:

```text
backend/public/images/
```

I also verified the Docker deployment so the image files were included using:

```dockerfile
COPY public ./public
```

This was tested by directly accessing the deployed `/images/<filename>` endpoint.

---

## 20. Known Limitations

### Filters

The available filters are limited to:

- Category
- Price range
- Availability

The original product dataset does not contain richer attributes such as:

- Fabric
- Occasion
- Material
- Brand-specific attributes

### Search

Search currently uses PostgreSQL `ILIKE`.

At larger scale, this could be improved using:

- `pg_trgm`
- GIN indexes
- PostgreSQL full-text search
- Dedicated search infrastructure

### Wishlist

The wishlist heart is currently a visual demo.

Selections are not persisted.

### Basket and Account

Basket and account controls are currently UI/demo elements and are not connected to authentication or persistent user state.

### Newsletter

Newsletter signup is currently not connected to a backend subscription service.

### Testing

Automated unit tests cover core:

- API validation
- Query parsing
- Error handling
- Pagination
- Image references
- URL state
- Structured data
- UI states

With more time, browser-level E2E tests could be added for:

- Search
- Filters
- Sorting
- Pagination
- Product detail navigation
- Responsive layouts

---

## 21. Security

Production secrets are stored in hosting-provider environment variables.

The following are **NOT** committed to GitHub:

- `.env`
- `.env.local`
- `DATABASE_URL`
- Neon database credentials
- API keys
- Passwords

The frontend does not receive the production database connection string.

Only the backend requires access to PostgreSQL.

---

## 22. Final Project Links

### GitHub Repository

https://github.com/Shivamkumar31/e-commerse

### Live Frontend

https://e-commerse-blond.vercel.app/

### Live Backend API

https://e-commerse-svm1.onrender.com/

### Swagger Documentation

https://e-commerse-svm1.onrender.com/docs

### Backend Health Check

https://e-commerse-svm1.onrender.com/health

---

## 23. Submission

The project submission includes:

1. GitHub repository
2. Live Vercel frontend
3. Live Render backend
4. Swagger API documentation
5. Neon PostgreSQL database
6. Dockerized backend
7. SSR Next.js frontend
8. SEO metadata and structured data
9. Product filtering, sorting, search and pagination
10. Local product image assets
11. Setup and deployment documentation