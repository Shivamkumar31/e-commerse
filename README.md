# Appscrip-task-Shivam – Product Listing Page (PLP)

Full-stack PLP: Next.js (SSR) frontend + Express/Prisma API + PostgreSQL.

## 1. Live links
- Frontend: `https://<your-app>.vercel.app`  ← fill after deploy
- API: `https://<your-api>.onrender.com`
- API docs (Swagger): `https://<your-api>.onrender.com/docs`

These are deployment placeholders, not live services. Replace them with verified URLs after deploying; do not publish secrets or database connection strings.

## 2. Tech stack and why
| Part | Choice | Why |
|---|---|---|
| Frontend | Next.js 15.5 App Router + TypeScript | SSR with Server Components, URL-driven state, built-in `next/image` and metadata API |
| Backend | Node + Express + TypeScript | Explicitly allowed; small, clean layered structure (routes → validate → controller → service) |
| DB | PostgreSQL + Prisma | Typed queries, migrations, easy indexes. Neon/Supabase/Render all host Postgres |
| Validation | zod | One schema gives validation, coercion, defaults and typed output |
| Styling | Plain CSS (one shared file) | Static HTML/CSS first; both the prototype and React app use `frontend/src/app/globals.css`; no UI kit |

## 3. Run locally
```bash
# 1) Database (any Postgres). Quick option with Docker:
docker run --name plp-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=plp -p 5432:5432 -d postgres:16

# 2) Backend
cd backend
cp .env.example .env            # edit DATABASE_URL if needed
npm ci
npx prisma migrate deploy       # applies prisma/migrations (or `npm run migrate:dev`)
npm run seed                 # loads the curated sample catalog and references backend/public/images
npm test                     # run backend validation, query, error, pagination and image tests
npm run typecheck
npm run build
npm run dev                  # http://localhost:4000  (docs: /docs)

# 3) Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm ci
npm test                     # run URL-state, structured-data, and UI-state tests
npm run typecheck
npm run build
npm run dev                  # http://localhost:3000
```
`static-html/index.html` is step 1 of the task (plain HTML + CSS, open it directly in a browser). It uses the same stylesheet and six real local seeded products/images as the app; its controls are disabled because the prototype is intentionally static.
The product images referenced by the seed are kept in `backend/public/images/` and must be included in deployment artifacts.

## 4. Architecture and folders
```
backend/
  prisma/            schema.prisma, migrations/, seed.ts
  src/config/        env.ts (validated environment)
  src/lib/           prisma client, AppError, asyncHandler
  src/middleware/    validate.ts, errorHandler.ts
  src/modules/       products/ (schema, service, controller, routes), categories/
  src/docs/          openapi.ts (Swagger)
frontend/src/
  app/               layout, page (SSR), products/[slug] detail page, loading, error, globals.css
  components/        Header, Footer, ProductCard, SearchForm, Filters, SortSelect, FilterToggle, Pagination, EmptyState
  lib/               api (server fetch), query (URL <-> state), seo (JSON-LD), useQueryNavigation, config, format
static-html/         step-1 static version
```
Flow: Browser → Next server (Server Component fetches `API_URL/products?...`) → Express → Prisma → Postgres.
Search, filtering, and sorting in the browser use Next client navigation with URL query parameters; Next re-renders the server component data without a full document reload. Pagination uses crawlable Next links.

## 5. API endpoints (full docs at `/docs`)
- `GET /products?page&limit&category&minPrice&maxPrice&sort&q&inStock` → `{ data, meta }`
  - `sort`: `recommended | newest | popular | price_asc | price_desc`; `category` is comma-separated slugs
- `GET /products/:id`
- `GET /products/slug/:slug`
- `GET /categories`
- `GET /health`
Errors always look like `{ "error": { "statusCode", "code", "message", "details?" } }` (400 validation, 404 not found, 500 internal).

## 6. SSR and SEO decisions
- `app/page.tsx` is an async Server Component: products are in the initial HTML (check "View source").
- Filter/sort/page live in the URL, parsed by one function (`lib/query.ts`) on server and client → shareable and crawlable links; pagination uses real `<a href="?page=2">`.
- Unique `<title>`/description per page (`generateMetadata`), canonical URL with normalised params, Open Graph tags.
- One `<h1>`, `<h2>` for filters/products, `<h3>` per product; semantic `header/nav/main/aside/section/article/footer`.
- JSON-LD: `ItemList` of `Product` (with `Offer`, rating) + `BreadcrumbList`; each product links to its detail URL.
- Product detail pages are server-rendered at `/products/<slug>`, with product metadata, canonical URL, Open Graph image, breadcrumb, and Product/Offer JSON-LD.
- Images: descriptive local filenames (`mens-casual-jacket.jpg`), meaningful alt text, `next/image` (AVIF/WebP, responsive `sizes`, lazy loading except first row).
- Loading (`loading.tsx` skeleton + dimmed results while navigating), empty state, and error state (`error.tsx`).

## 7. Dependencies and why
Frontend runtime: `next`, `react`, `react-dom`. Dev/test: TypeScript types and `tsx` (TypeScript unit tests); an npm override keeps Next.js's transitive PostCSS at a patched version. Fonts via `next/font`, images via `next/image`, no UI kit, no state library, no CSS framework.
Backend runtime: `express` (HTTP), `cors`, `helmet` (security headers), `zod` (validation), `dotenv` (env), `@prisma/client` + `prisma` (ORM/migrations), `swagger-ui-express` (API docs UI). Dev/test: `typescript`, `tsx` (dev server, seed and tests), type packages.

## 8. AI usage
- Tools used: Claude (project scaffold, boilerplate, comments).
- Where it helped: folder structure, zod schemas, Prisma query builders, CSS from the Figma screenshots.
- **One example where I corrected/rejected AI output:** *(write your own real example here before submitting – e.g. a bug you found and fixed. Be honest; you will be asked about it.)*
- Context file for AI tools: `AGENTS.md`.

## 9. Known limitations / next steps
- Filters limited to category, price, availability (FakeStore data has no fabric/occasion etc. from the Figma sidebar).
- Search uses `ILIKE`; at scale add a `pg_trgm` GIN index or full-text search.
- Wishlist selection is a visual demo and is not persisted. Basket and account controls are demo-only; newsletter signup is not connected. Navigation/footer labels without destinations are presented as non-links instead of routing incorrectly.
- Automated unit tests cover core API/query/state paths. Add browser E2E tests against a running database-backed app, including filter/sort/pagination navigation and responsive overflow.
- Frontend `npm audit` and backend `npm audit --omit=dev` both report zero vulnerabilities after upgrading Next.js to 15.5.24 and constraining PostCSS to the patched 8.5.x line. Re-run audits after dependency changes.

## Deploy
1. **DB**: create a Postgres on Neon/Supabase/Render, copy the connection string.
2. **Backend (Render Web Service, root `backend`)**: Build `npm ci && npm run build && npm run seed`, Start `npm start`. Env: `DATABASE_URL`, `CORS_ORIGINS=https://<frontend>`, `PUBLIC_API_URL=https://<api>`, `NODE_ENV=production`. Ensure `backend/public/images/` is part of the deployed source/build context; the seed-image test checks local references.
3. **Frontend (Vercel, root `frontend`)**: env `API_URL=https://<api>`, `NEXT_PUBLIC_SITE_URL=https://<frontend>`.
4. **Post-deploy verification:** Check `GET /health`, `GET /products?limit=2`, `GET /products/slug/<seed-slug>`, and at least one `/images/<filename>` response. Then confirm “View source” for the frontend contains rendered product content and verify canonical/OG metadata. Replace the placeholder live links above only after these checks.
