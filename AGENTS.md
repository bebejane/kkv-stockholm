# AGENTS.md

KKV Stockholm — Next.js 16 (App Router, `--turbo`), React 19, TypeScript, pnpm. Public Swedish site + member area for Konst & Teknik Stockholm.

## Big-picture split

- **Content and business data live in DatoCMS** (courses, workshops, equipment, **bookings, members, reports**). Reads go through `apiQuery` from the private `next-dato-utils` lib (CDA); writes go through the CMA client in `lib/client.ts`. Controllers in `lib/controllers/*.ts` are the layer between API routes and DatoCMS/DB.
- **Auth/sessions live in Turso (libsql) via better-auth + Drizzle** (`db/auth-schema.ts`, `db/index.ts`). Auth users are separate from DatoCMS member records — controllers link them. Member accounts are created at **approval** (`handleMemberChange` on `PAID`/`ACTIVE` with no user): it creates the better-auth user (`auth.api.createUser`, random password, `emailVerified: true`) and emails a first-time link to **`/skapa-konto`** via better-auth's password-reset flow (`redirectTo=/skapa-konto`); `member.user` links member↔user and `member_status` becomes `ACTIVE` when the invite is sent. The former custom `verification_token` JWT flow has been removed.
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
- Verification: no test framework and no CI. `pnpm typecheck` (`tsc --noEmit`) and `pnpm lint` (ESLint flat config in `eslint.config.mjs`) both work and are expected to stay green — `next build` no longer ignores type errors. A few React-Compiler lint warnings remain.
- Smoke-test controllers/scripts with `tsx`, e.g. `tsx scripts/test-spiris.ts`, `tsx lib/scripts/test-controller.ts`.
- `pnpm dev:email` — react-email dev server (port 4000).
- `pnpm reset:cache` — clear `.next/cache`. `pnpm reset` is nuclear (deletes `node_modules` and the lockfile).
- Drizzle has no npm script — use `pnpm exec drizzle-kit generate|migrate|studio` directly (schemas `db/auth-schema.ts` + `db/spiris-schema.ts`, dialect `turso`, output `db/migrations/`). Note: this database's `__drizzle_migrations` was baselined manually (the auth tables predated the journal); `migrate` is consistent now, but a fresh DB applies `0000`+`0001` normally.

## Codegen (generated files are COMMITTED — regenerate and commit after changes)

- `graphql/*.gql` → `pnpm codegen:graphql` emits `graphql/index.ts` (typed-document-node, consumed as `import { XDocument } from '@/graphql'`) and `types/datocms.cda.ts`. Documents are validated against the **live DatoCMS schema** (`skipDocumentsValidation: false`), so codegen fails on stale queries — an outdated `types/datocms.ts` causes cascading `.gql` errors.
- `pnpm codegen:datocms` → `types/datocms.ts` via `datocms schema:generate`. Run this after DatoCMS model changes.
- Both need `DATOCMS_API_TOKEN` and `DATOCMS_ENVIRONMENT`. `pnpm dev` runs them in watch mode for you.

## Environment

`.env` is gitignored (no example file). Required names: `NEXT_PUBLIC_SITE_URL`, `DATOCMS_API_TOKEN`, `NEXT_PUBLIC_DATOCMS_API_TOKEN`, `NEXT_PUBLIC_UPLOADS_API_TOKEN`, `NEXT_PUBLIC_UPLOADS_COLLECTION_ID`, `NEXT_PUBLIC_DATOCMS_BASE_EDITING_URL`, `DATOCMS_ENVIRONMENT` (+ `NEXT_PUBLIC_…` twin), `DATOCMS_PREVIEW_SECRET`, `BASIC_AUTH_USER/PASSWORD`, `CRON_SECRET`, `REVALIDATE_TIME`, `DATABASE_URL`/`DATABASE_AUTH_TOKEN` (Turso), `BETTER_AUTH_SECRET` + `BETTER_AUTH_DEFAULT_ADMIN_{EMAIL,PASSWORD,NAME}`, `POSTMARK_API_TOKEN/FROM_NAME/FROM_EMAIL`, `SPIRIS_CLIENT_ID/CLIENT_SECRET/REFRESH_TOKEN`, `SPIRIS_TOKEN_ENCRYPTION_KEY`.

`DATOCMS_ENVIRONMENT` must stay consistent across the DatoCMS dashboard, `graphql.config.ts`, codegen, and `lib/client.ts` — a mismatch produces confusing 4xx errors from an unseen environment.

Server-side user management (ban/unban, role, delete, verify) goes through better-auth's **admin plugin** via `auth/auth-admin.ts`: it signs in as the default admin (`BETTER_AUTH_DEFAULT_ADMIN_EMAIL/PASSWORD`, cached session) and calls `auth.api.banUser/unbanUser/setRole/removeUser/adminUpdateUser`. That account must be **e-mail verified** and have role **`admin`** — `auth/init.ts` (prebuild) grants the role, but verification is manual. `findUser`/`findUserByEmail` stay as direct Turso reads (cheap, no session dependency).

The member webhooks (`member-status`, `member-role`, `spiris/member-sync`) subscribe to `create`/`update` only and act **only on real transitions**, using the payload's `previous_entity` (`lib/webhook.ts`). Don't add `publish`/`unpublish`: with draft mode off the member model emits an implicit `publish` as a duplicate of every `update`.

Member account invites reuse better-auth's password-reset token, so `sendResetPassword` (`auth/auth.ts`) picks the DatoCMS template by the `callbackURL`: invites (`/skapa-konto`) use **`create_your_account`**, genuine resets use **`reset_password`**. `/skapa-konto` is the first-time page; `/aterstall-losenord` → `/nytt-losenord` is the forgot-password flow. The member `verification_token` field is legacy/unused (candidate for removal from the DatoCMS model).

Spiris/Visma OAuth refresh tokens live in the Turso `oauth_token` table (`db/spiris-schema.ts`), managed by `lib/spiris/auth.ts` (rotated on refresh with a compare-and-set; access token cached in memory). `SPIRIS_REFRESH_TOKEN` is only a first-run seed — after that the DB is the source of truth. Re-authorize via `/api/spiris/auth/callback` (admin) or `pnpm spiris:auth`; both write to the DB. Set `SPIRIS_TOKEN_ENCRYPTION_KEY` (AES-GCM, `openssl rand -base64 32`) to encrypt the token at rest — the **same key must be present in every environment that shares the DB** (local `.env` + Vercel), or an environment without it can't decrypt the stored value and Spiris calls fail.

The DatoCMS plugin API gate (`lib/dato-plugin-auth.ts`) verifies that the caller's token belongs to this project by comparing the CMA `/site` id against the id resolved from `DATOCMS_API_TOKEN`, so a token from another DatoCMS project can never pass. It does not restrict by e-mail.

## Gotchas

- SCSS modules + Mantine; `sassOptions.prependData` injects `@use "sass:math"` and `@use "@/styles/mediaqueries"` into every SCSS file (don't re-import).
- `devIndicators` and Next `logging` are disabled; don't be surprised by missing dev tooling wires.
- Vercel deploys with a nightly cron (`vercel.json` → `/api/backup?max=1`, DatoCMS backup).
- Admin/editor area: `lib/dato-plugin-auth.ts` gates the plugin; `app/(datocms)/plugin/*` pages are served at `/plugin`.