import { applySetCookies, splitSetCookieHeader } from 'better-auth/cookies';
import { auth } from '@/auth/auth';

/**
 * Server-side access to better-auth's admin APIs.
 *
 * The admin plugin's endpoints require an admin session, but our calls come
 * from webhooks/controllers with no request context. So we sign in once as the
 * default admin account (same account `auth/init.ts` ensures), cache the session
 * cookies in memory, and pass them to `auth.api.*`.
 *
 * Requires:
 * - `BETTER_AUTH_DEFAULT_ADMIN_EMAIL/PASSWORD` (env)
 * - that account to be e-mail verified (to sign in)
 * - that account to have role `admin` (set by `auth/init.ts` on build)
 */

const SESSION_TTL_MS = 60 * 60 * 1000;

let cached: { headers: Headers; expiresAt: number } | null = null;

function getSetCookies(headers: Headers): string[] {
	const h = headers as Headers & { getSetCookie?: () => string[] };
	return typeof h.getSetCookie === 'function'
		? h.getSetCookie()
		: splitSetCookieHeader(headers.get('set-cookie') ?? '');
}

async function adminHeaders(): Promise<Headers> {
	if (cached && Date.now() < cached.expiresAt) return cached.headers;

	const email = process.env.BETTER_AUTH_DEFAULT_ADMIN_EMAIL;
	const password = process.env.BETTER_AUTH_DEFAULT_ADMIN_PASSWORD;
	if (!email || !password)
		throw new Error(
			'BETTER_AUTH_DEFAULT_ADMIN_EMAIL and BETTER_AUTH_DEFAULT_ADMIN_PASSWORD are required for admin operations',
		);

	const { headers: signInHeaders } = await auth.api.signInEmail({
		returnHeaders: true,
		body: { email, password },
	});

	// The sign-in response carries `set-cookie`; turn those into request cookies.
	const headers = new Headers();
	const setCookies = getSetCookies(signInHeaders);
	if (setCookies.length > 0) applySetCookies(headers, setCookies);

	cached = { headers, expiresAt: Date.now() + SESSION_TTL_MS };
	return headers;
}

function isUnauthorized(e: unknown): boolean {
	const err = e as { status?: number; statusCode?: number; body?: { code?: string } };
	const message = e instanceof Error ? e.message.toUpperCase() : '';
	return (
		err?.status === 401 ||
		err?.statusCode === 401 ||
		err?.body?.code === 'UNAUTHORIZED' ||
		message.includes('UNAUTHORIZED')
	);
}

/** Runs an admin API call, refreshing the service session once if it went stale. */
async function withAdmin<T>(fn: (headers: Headers) => Promise<T>): Promise<T> {
	try {
		return await fn(await adminHeaders());
	} catch (e) {
		if (!isUnauthorized(e)) throw e;
		cached = null;
		return fn(await adminHeaders());
	}
}

export async function banAuthUser(userId: string, banReason = 'Inaktiverad'): Promise<void> {
	await withAdmin((headers) => auth.api.banUser({ body: { userId, banReason }, headers }));
}

export async function unbanAuthUser(userId: string): Promise<void> {
	await withAdmin((headers) => auth.api.unbanUser({ body: { userId }, headers }));
}

export async function setAuthUserRole(userId: string, role: 'admin' | 'user'): Promise<void> {
	await withAdmin((headers) => auth.api.setRole({ body: { userId, role }, headers }));
}

export async function removeAuthUser(userId: string): Promise<void> {
	await withAdmin((headers) => auth.api.removeUser({ body: { userId }, headers }));
}

export async function markAuthUserVerified(userId: string): Promise<void> {
	await withAdmin((headers) =>
		auth.api.adminUpdateUser({ body: { userId, data: { emailVerified: true } }, headers }),
	);
}
