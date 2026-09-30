import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Long-lived OAuth refresh tokens for server-to-server integrations (e.g.
 * Spiris/Visma). Stored here instead of an env var so token rotation survives
 * cold starts and is shared across serverless instances.
 *
 * Kept in a separate file from `auth-schema.ts`, which better-auth owns and
 * regenerates.
 */
export const oauthToken = sqliteTable('oauth_token', {
	/** Integration id, e.g. `spiris`. */
	provider: text('provider').primaryKey(),
	/** Encrypted refresh token (see `lib/spiris/token-crypto.ts`). */
	refreshToken: text('refresh_token').notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull(),
});
