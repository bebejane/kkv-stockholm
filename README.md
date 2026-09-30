## Nextjs DatoCMS Boilerplate

### Spiris/Visma refresh tokens

The Spiris OAuth refresh token is stored in the Turso `oauth_token` table
(`db/spiris-schema.ts`) and rotated automatically by `lib/spiris/auth.ts`.
`SPIRIS_REFRESH_TOKEN` is only a first-run seed — after that the database is the
source of truth. Re-authorize via `/api/spiris/auth/callback` (as an admin) or
`pnpm spiris:auth`; both write the new token to the database.

If `SPIRIS_TOKEN_ENCRYPTION_KEY` is set, the token is encrypted at rest (AES-GCM).
The **same key must be set in every environment that shares the database**
(local `.env` and Vercel production/preview) — an environment without the key
cannot decrypt the stored value and Spiris calls will fail. Generate one with:

```
openssl rand -base64 32
```
