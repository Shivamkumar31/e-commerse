# AGENTS.md – context for AI coding tools

Monorepo: `/backend` (Express + Prisma + PostgreSQL) and `/frontend` (Next.js 14 App Router, TypeScript).

## Rules
- Frontend never calls FakeStore; it only calls our API (`API_URL`) from Server Components.
- URL query params are the single source of truth for filters. Parse/serialise ONLY via `frontend/src/lib/query.ts`.
- Query param names are identical on frontend and backend (`page, category, minPrice, maxPrice, sort, q, inStock`).
- Backend layers: routes -> validate (zod) -> controller -> service (only place that talks to Prisma). Errors use `AppError`.
- Keep dependencies minimal; justify any new one in README. No UI kits.
- Keep the DOM lean (no wrapper divs without purpose), semantic HTML, one `<h1>` per page.
- Every function gets a doc comment explaining what it does and why it exists.
- No secrets in git; use `.env.example`.

## Commands
- Backend: `npm run dev`, `npm run migrate:dev`, `npm run seed`, `npm run typecheck`
- Frontend: `npm run dev`, `npm run build`, `npm run typecheck`
