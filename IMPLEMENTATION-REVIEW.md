# Appscrip Product Listing Page — Requirements Review

**Review date:** 2026-10-07  
**Scope:** Static HTML/CSS prototype, Next.js frontend, Express API, Prisma schema/migration/seed, configuration examples, and README.  
**Overall assessment:** The project has a solid full-stack foundation and implements most of the assignment’s core architecture. Priority 0, Priority 1, and feasible Priority 2 improvements are complete. Type-checks, builds, unit tests, dependency audits, and selected browser checks pass. Hosted deployment, a repeatable browser E2E suite, Lighthouse, and screen-reader checks remain outstanding.

## Executive summary

| Area | Assessment |
|---|---|
| Frontend structure and core PLP | **Implemented** — Next.js App Router, server-rendered listing, product cards, filters, sorting, pagination, and responsive CSS are present. |
| Loading, empty, and error states | **Implemented in code** — loading skeleton, no-results state, and retryable error boundary exist. Runtime behavior was not exercised. |
| Backend and database | **Implemented in code** — Express REST routes, Zod validation, consistent errors, Swagger docs, PostgreSQL/Prisma schema, migration, indexes, and seed script are present. |
| SSR and URL state | **Verified locally** — listing and product detail pages are server rendered; search, category, sort, and pagination update URL state through Next navigation. |
| SEO/accessibility | **Improved** — product detail pages have unique metadata, canonical URLs, breadcrumbs, and Product JSON-LD; listing structured data points to those pages. Demo-only controls are disclosed. |
| Responsive/no horizontal scroll | **Live browser checked** — listing and detail pages had no horizontal overflow at viewport widths 320, 375, 768, 1024, and 1440 CSS pixels. |
| Build/type validation | **Passes** — frontend/backend type-checks and production builds completed successfully after restricting ambient TypeScript types to each package's required types. |
| Deployment readiness | **Improved** — product image paths are no longer excluded by Git ignore rules, and a test checks that each seeded image exists. README deployment URLs are placeholders. |
| Static prototype | **Aligned** — six named local seed products use descriptive image alt text and the exact stylesheet used by the functional app. |
| Production dependency advisories | **Addressed** — frontend `npm audit` and backend `npm audit --omit=dev` report zero vulnerabilities after the framework/transitive CSS dependency update. |

## What is already working in the implementation 

### Frontend

- `static-html/index.html` provides a plain HTML/CSS first-pass design with local seed products; it references the same `frontend/src/app/globals.css` used by the Next.js app.
- The frontend uses Next.js 15 App Router with TypeScript and keeps dependencies minimal (Next, React, and React DOM).
- `frontend/src/app/page.tsx` is an async Server Component. It fetches products and categories from the project’s own API, so product content is intended to be present in the initial server-rendered HTML.
- Product cards display image, title, price, new/out-of-stock labels, and a wishlist control.
- Category, price, stock, sort, search, and pagination query parameters are parsed centrally in `frontend/src/lib/query.ts`.
- Filter and sort controls use Next navigation, and pagination uses crawlable links.
- Dedicated loading skeleton, empty state, and error boundary components are present.
- Responsive CSS changes the grid from two columns on small screens to three on tablet and four on desktop when filters are hidden. Grid columns use `minmax(0, 1fr)` to reduce overflow risk.
- `next/image` is used with responsive `sizes`, fixed dimensions, eager loading for the first cards, and AVIF/WebP output configuration.
- Metadata includes title, description, canonical URL, and Open Graph data. JSON-LD includes an `ItemList` and `BreadcrumbList`.
- Semantic landmarks, headings, form labels, skip navigation, focus-visible styles, and reduced-motion handling are present.

### Backend and data

- The Express application exposes `GET /products`, `GET /products/:id`, `GET /categories`, and `GET /health`.
- Product listing supports pagination, category, price range, stock status, sort order, and search.
- Zod schemas validate and coerce query and path parameters; a shared error handler formats validation, not-found, and internal errors.
- CORS origins and server/database settings are configured through environment variables. `.env` files are ignored, and example environment files are provided.
- Swagger/OpenAPI documentation is served at `/docs`.
- Prisma models products, categories, and product images; a migration creates the tables, foreign keys, and filter/sort indexes.
- The seed script upserts product/category data and image records. The project includes named image files in the current workspace.
- The API service constructs database queries from validated filters and returns pagination metadata with results.

## Improvements and remaining work

### Priority 0 — status after follow-up work

1. **Dependency and TypeScript checks — resolved.**  
   Dependencies were restored from the lockfiles. The initial errors came from TypeScript discovering unrelated ambient types in a parent `node_modules`; package `tsconfig.json` files now explicitly select their required ambient types. Both type-checks and production builds pass.

2. **Product images in deployments — source rules fixed; deployment still needs confirmation.**  
   Removed the image exclusion patterns from the repository and backend ignore files, so the named assets can be included with a clean checkout. Added a backend test asserting every image referenced in the seed exists under `backend/public/images/`. The test passes. Confirm that the hosting platform's build context includes this directory after deployment.

3. **Automated checks — unit coverage added; persisted browser E2E remains.**  
   Added backend tests for image references, input validation, slug validation, product filters/sort/pagination metadata, missing-product errors, and API error envelopes. Added frontend tests for query parsing/serialization, detail structured-data URLs, and loading, empty, and error-state rendering. All 15 tests pass. Live browser interaction and responsive checks were also performed manually; a committed repeatable browser E2E suite is still a quality improvement.

### Priority 1 — status after follow-up work

4. **Client-side search — implemented and exercised.**  
   Search now uses Next navigation and preserves query state without a full document reload. Local browser check searched for `ring` and reached `/?q=ring` with matching results.

5. **Seed/setup documentation — corrected.**  
   README now describes the local curated seed data and referenced image assets instead of claiming the seed downloads FakeStore content. It documents commands for tests, type-checks, and builds.

6. **Demo-only controls — clarified.**  
   Wishlist selection is labeled as not saved, basket/account icons identify as demo-only, newsletter signup is explicitly unavailable, and navigation/footer labels without routes are no longer misleading links.

7. **Product detail and structured-data URLs — implemented and exercised.**  
   Added `GET /products/slug/:slug`, a server-rendered `/products/[slug]` route, per-product title/description/canonical/Open Graph metadata, breadcrumb markup, Product/Offer JSON-LD, and links from listing cards and ItemList entries. A live local product slug rendered with its canonical URL and JSON-LD.

8. **Responsive overflow and interactions — locally checked.**  
   Listing and product detail routes had no horizontal overflow at widths 320, 375, 768, 1024, and 1440 CSS pixels. Local browser checks also confirmed search, category filtering, sorting, and pagination URLs/results. This is a manual browser check, not a committed cross-browser E2E suite.

9. **Deployment information — verification guide added; live URLs remain pending.**  
   README now lists deployment environment variables and post-deploy endpoint/image/SSR checks. Actual hosted URLs cannot be filled in until deployment is performed and verified.

### Priority 2 — quality and maintainability

10. **Static prototype alignment — complete.**  
    Replaced repeated placeholder names and empty media with six named products, local seed images, prices, meaningful alt text, and matching header/footer structure. Removed the duplicate `static-html/style.css`; the prototype references the app stylesheet directly. Controls requiring app behavior are disabled in this static-only page. The browser check confirmed all six images load.

11. **Accessibility/performance spot checks — partially complete.**  
    Checked the static page's first keyboard stop (skip link), one-H1 structure, descriptive alt text, image loading, and no-overflow behavior at 320, 375, 768, 1024, and 1440 CSS pixel viewports. Computed body and footer-copy text/background colors exceed WCAG AA contrast for normal text. A Lighthouse run, screen-reader check, and complete keyboard-only flow remain outstanding; no Lighthouse score is claimed.

12. **Search scalability — measured decision documented.**  
    Search remains case-insensitive substring matching. The default seed creates 60 products (20 curated records with three editions each), and no representative production catalog or query-latency baseline exists, so adding a PostgreSQL `pg_trgm` extension/index now would add migration/hosting assumptions without demonstrated benefit. Revisit with production-sized data, `EXPLAIN (ANALYZE, BUFFERS)`, and a latency target; choose a trigram or full-text index based on the required matching behavior.

13. **Production dependency advisories — addressed and verified.**  
    Updated Next.js from 14.2.15 to 15.5.24 (compatible with the existing React 18 line) and constrained transitive PostCSS to `^8.5.23`; the lockfile resolves PostCSS 8.5.29. Adapted Next 15 route props to async `params`/`searchParams`. Frontend `npm audit` and backend `npm audit --omit=dev` report zero vulnerabilities. Frontend type-check, 7 tests, and production build pass.

## Requirement-by-requirement status

| Requirement | Status | Evidence / notes |
|---|---|---|
| Plain HTML/CSS first, then functional framework app | **Present** | `static-html/` is a static prototype sharing the app stylesheet and representative local seed data; `frontend/` is the functional app. |
| React with Next.js App Router and TypeScript | **Present** | Frontend package and `src/app/` structure. |
| Header, navigation, footer, product cards | **Present** | Header/footer and product cards exist; unavailable controls are identified as demos or rendered as non-links. |
| Filters and sorting | **Present** | Category, price, availability, and sort controls update query state. |
| Pagination or infinite scroll | **Present** | Server-rendered pagination links with query parameters. |
| Loading, empty, and error states | **Present in source** | `loading.tsx`, `EmptyState`, and `error.tsx`; runtime path testing remains. |
| Responsive desktop/tablet/mobile | **Locally verified** | Live listing and detail pages checked at widths 320, 375, 768, 1024, and 1440 CSS pixels. |
| No horizontal scroll at every breakpoint | **Locally checked** | No document overflow detected on listing or detail routes at the tested viewport widths. |
| SSR with initial products in source | **Verified locally** | Live Next.js listing rendered its product cards from the server-backed API. |
| URL reflects filter/sort/page state | **Verified locally** | Search, category filter, sort, and pagination interactions updated query parameters in browser. |
| REST endpoints and query support | **Present** | Express routes and Zod query schema cover the required operations; slug-based product detail endpoint was added. |
| Input validation and consistent errors | **Present** | Shared Zod validation middleware and JSON error handler. |
| API documentation | **Present** | Hand-authored OpenAPI document served by Swagger UI at `/docs`. |
| CORS, environment config, secret handling | **Present in source** | Environment parsing and ignored `.env` files; actual deployment configuration was not inspected. |
| PostgreSQL ORM, schema, migration, indexes | **Present** | Prisma schema and SQL migration. |
| Seed script | **Present; documentation corrected** | Curated records and local image paths; README no longer claims a FakeStore download. |
| Frontend SSR fetches own API | **Present** | API client uses `API_URL`; it does not call FakeStore from the frontend. |
| SEO metadata and structured data | **Implemented** | Listing and detail metadata, canonical URLs, OG, ItemList/Product, BreadcrumbList; Product URLs lead to slug detail pages. |
| Image filenames, alt text, optimization | **Present; asset inclusion fixed in source** | Descriptive names, alt text, `next/image`; ignore patterns were removed and seed-image existence is tested. Verify host packaging after deployment. |
| Minimal dependencies / no UI kit | **Present** | Small frontend dependency set and custom CSS; PostCSS is version-constrained through an npm override to address advisories. |
| Automated tests/build verification | **Verified for build/typecheck/unit scope** | 8 backend tests and 7 frontend tests pass; both type-checks and production builds pass. |

## Verification performed and limits

- Reviewed the README, AGENTS instructions, package manifests, app/page/layout/error/loading files, major UI components, query/API/SEO helpers, responsive CSS, Express routes/middleware, Prisma schema/migration/seed, and ignore rules.
- Restored dependencies (`npm install` in frontend to add the test runner and update its lockfile; `npm ci` in backend).
- Ran backend and frontend type-checks successfully.
- Ran backend tests: 8 passed. Ran frontend tests: 7 passed.
- Built backend (`prisma generate && tsc`) and frontend (`next build`) successfully.
- After Priority 2, upgraded frontend Next.js to 15.5.24, updated route props for Next 15, resolved PostCSS 8.5.29 through an npm override, and re-ran frontend type-check, 7 tests, production build, and full `npm audit` successfully.
- Re-ran backend type-check, 8 tests, production build, and production-only `npm audit` successfully.
- Served the production Next.js build locally against the API: confirmed server-rendered product cards, filtered SSR output, listing JSON-LD, product detail title/canonical/Product JSON-LD, and client-side search updating both URL and results.
- Opened the static prototype in a browser: all six images loaded and had alt text, one H1 was present, and no document overflow occurred at 320, 375, 768, 1024, or 1440 CSS pixel viewports. The first keyboard tab focused the skip link; measured body/footer-copy colors met WCAG AA contrast.
- Started the local backend and frontend; checked `/health`, product listing, a product-slug response, and an image URL.
- Exercised search, category filter, sort, pagination, and product-detail navigation in the browser.
- Checked live listing and product detail overflow at 320, 375, 768, 1024, and 1440 CSS pixel viewport widths; all reported no horizontal overflow.
- Did not inspect `backend/.env` or `frontend/.env.local`; secrets and local values were intentionally left unread.
- Did not test an actual hosted deployment, multiple browser engines, screen-reader behavior, Lighthouse metrics, or a complete keyboard-only user flow. Real deployment URLs remain placeholders until provisioned and verified.
