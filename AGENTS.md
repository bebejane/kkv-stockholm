# AGENTS.md

KKV Stockholm — Next.js 16 (App Router, `--turbo`), React 19, TypeScript, pnpm. Public Swedish site + member area for Konst & Teknik Stockholm.

## Big-picture split

- **Content and business data live in DatoCMS** (courses, workshops, equipment, **bookings, members, reports**). Reads go through `apiQuery` from the private `next-dato-utils` lib (CDA); writes go through the CMA client in `lib/client.ts`. Controllers in `lib/controllers/*.ts` are the layer between API routes and DatoCMS/DB.
- **Auth/sessions live in Turso (libsql) via better-auth + Drizzle** (`db/auth-schema.ts`, `db/index.ts`). Auth users are separate from DatoCMS member records — controllers link them.
- Emails: react-email templates in `emails/`, sent via Postmark (`lib/controllers/email.tsx`, `lib/postmark.tsx`).
- Invoicing: Spiris integration under `lib/spiris/` (OAuth refresh-token flow; `scripts/get-spiris-token.ts` to obtain one).
- `next-dato-utils` (`github:bebejane/next-dato-utils`) provides most DatoCMS plumbing: `apiQuery`, the API router, `DraftModeContentLink`, sitemap/manifest/robots via `datocms.config.ts`. Shared fixes belong there, not here.

## Route groups

- `app/(website)/` — public pages + member area (`/medlem/*`) + member-facing API routes.
- `app/(datocms)/` — DatoCMS plugin UI (`/plugin`) and the catch-all `api/[route]/route.ts` that hands `/api/*` (web-previews, backup) to `next-dato-utils/router`.
- Root `proxy.ts` is the middleware (sets `x-url`, matcher `/medlem/:path*`).

## Commands

- `pnpm dev` — runs `next dev --turbo` **and codegen concurrently** (`codegen:datocms` + `codegen:graphql --watch`). The codegen watchers keep running; you must kill the whole process tree (e.g. `pkill -f "next dev"` won't get codegen).
- `pnpm build` runs `prebuild` first: `tsx ./auth/init.ts` signs in / creates the default admin via better-auth, so **build requires a live Turso DB and `BETTER_AUTH_DEFAULT_ADMIN_*` env vars**.
- Verification: there is no test framework and no CI. `pnpm lint` is **broken** (`next lint` was removed from the Next 16 CLI, so it fails). `next build` sets `typescript.ignoreBuildErrors: true`, and the repo has known, pre-existing type errors — do **not** attempt to fix all `tsc --noEmit` errors; use it only to check newly-touched code.
- Smoke-test controllers/scripts with `tsx`, e.g. `tsx scripts/test-spiris.ts`, `tsx lib/scripts/test-controller.ts`.
- `pnpm dev:email` — react-email dev server (port 4000).
- `pnpm reset:cache` — clear `.next/cache`. `pnpm reset` is nuclear (deletes `node_modules` and the lockfile).
- Drizzle has no npm script — use `pnpm exec drizzle-kit generate|migrate|studio` directly (schema `db/auth-schema.ts`, dialect `turso`, output `db/migrations/`).

## Codegen (generated files are COMMITTED — regenerate and commit after changes)

- `graphql/*.gql` → `pnpm codegen:graphql` emits `graphql/index.ts` (typed-document-node, consumed as `import { XDocument } from '@/graphql'`) and `types/datocms.cda.ts`. Documents are validated against the **live DatoCMS schema** (`skipDocumentsValidation: false`), so codegen fails on stale queries — an outdated `types/datocms.ts` causes cascading `.gql` errors.
- `pnpm codegen:datocms` → `types/datocms.ts` via `datocms schema:generate`. Run this after DatoCMS model changes.
- Both need `DATOCMS_API_TOKEN` and `DATOCMS_ENVIRONMENT`. `pnpm dev` runs them in watch mode for you.

## Environment

`.env` is gitignored (no example file). Required names: `NEXT_PUBLIC_SITE_URL`, `DATOCMS_API_TOKEN`, `NEXT_PUBLIC_DATOCMS_API_TOKEN`, `NEXT_PUBLIC_UPLOADS_API_TOKEN`, `NEXT_PUBLIC_UPLOADS_COLLECTION_ID`, `NEXT_PUBLIC_DATOCMS_BASE_EDITING_URL`, `DATOCMS_ENVIRONMENT` (+ `NEXT_PUBLIC_…` twin), `DATOCMS_PREVIEW_SECRET`, `BASIC_AUTH_USER/PASSWORD`, `CRON_SECRET`, `REVALIDATE_TIME`, `DATABASE_URL`/`DATABASE_AUTH_TOKEN` (Turso), `BETTER_AUTH_SECRET` + `BETTER_AUTH_DATOCMS_*_TYPE_ID` (item-type IDs) + `BETTER_AUTH_DEFAULT_ADMIN_{EMAIL,PASSWORD,NAME}`, `POSTMARK_API_TOKEN/FROM_NAME/FROM_EMAIL`, `SPIRIS_CLIENT_ID/CLIENT_SECRET/REFRESH_TOKEN`.

`DATOCMS_ENVIRONMENT` must stay consistent across the DatoCMS dashboard, `graphql.config.ts`, codegen, and `lib/client.ts` — a mismatch produces confusing 4xx errors from an unseen environment.

## Gotchas

- SCSS modules + Mantine; `sassOptions.prependData` injects `@use "sass:math"` and `@use "@/styles/mediaqueries"` into every SCSS file (don't re-import).
- `devIndicators` and Next `logging` are disabled; don't be surprised by missing dev tooling wires.
- Vercel deploys with a nightly cron (`vercel.json` → `/api/backup?max=1`, DatoCMS backup).
- Admin/editor area: `lib/dato-plugin-auth.ts` gates the plugin; `app/(datocms)/plugin/*` pages are served at `/plugin`.