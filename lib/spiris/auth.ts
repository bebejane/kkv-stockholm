import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { oauthToken } from '@/db/spiris-schema';
import { decrypt, encrypt } from './token-crypto';
import { SpirisTokenResponse } from './types';

const PROVIDER = 'spiris';
const TOKEN_URL = 'https://identity.vismaonline.com/connect/token';

let accessToken: string | null = null;
let expiresAt: number | null = null;
/** De-duplicates concurrent refreshes within a single instance. */
let inFlight: Promise<void> | null = null;

export async function getAccessToken(): Promise<string> {
	if (accessToken && expiresAt && Date.now() < expiresAt) {
		return accessToken;
	}

	await refreshAccessToken();
	return accessToken!;
}

/** The raw stored value (still encrypted) — used as the compare-and-set guard. */
async function getStoredToken(): Promise<string | null> {
	const [row] = await db
		.select()
		.from(oauthToken)
		.where(eq(oauthToken.provider, PROVIDER));
	return row?.refreshToken ?? null;
}

async function storeToken(refreshToken: string): Promise<void> {
	const value = encrypt(refreshToken);
	await db
		.insert(oauthToken)
		.values({ provider: PROVIDER, refreshToken: value })
		.onConflictDoUpdate({
			target: oauthToken.provider,
			set: { refreshToken: value, updatedAt: new Date() },
		});
}

async function requestToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<SpirisTokenResponse> {
	const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

	const response = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${basicAuth}`,
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		}),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to refresh Spiris token: ${response.status} ${errorText}`);
	}

	return response.json();
}

async function resolveRefreshToken(): Promise<{ stored: string; plain: string }> {
	let stored = await getStoredToken();

	// Bootstrap from the env var on first use, then the DB is the source of truth.
	if (!stored) {
		const seed = process.env.SPIRIS_REFRESH_TOKEN;
		if (!seed)
			throw new Error(
				'Spiris refresh token is not set. Seed SPIRIS_REFRESH_TOKEN or re-authorize via /api/spiris/auth/callback.',
			);
		await storeToken(seed);
		stored = await getStoredToken();
		if (!stored) throw new Error('Failed to persist the Spiris refresh token.');
	}

	return { stored, plain: decrypt(stored) };
}

async function doRefresh(): Promise<void> {
	const clientId = process.env.SPIRIS_CLIENT_ID;
	const clientSecret = process.env.SPIRIS_CLIENT_SECRET;
	if (!clientId || !clientSecret)
		throw new Error(
			'Spiris credentials not configured. Set SPIRIS_CLIENT_ID and SPIRIS_CLIENT_SECRET.',
		);

	let { stored, plain } = await resolveRefreshToken();
	let data: SpirisTokenResponse;

	try {
		data = await requestToken(clientId, clientSecret, plain);
	} catch (e) {
		// Another instance may have rotated the token concurrently — retry once
		// with whatever is now stored.
		const latest = await getStoredToken();
		if (latest && latest !== stored) {
			stored = latest;
			plain = decrypt(latest);
			data = await requestToken(clientId, clientSecret, plain);
		} else {
			throw e;
		}
	}

	accessToken = data.access_token;
	expiresAt = Date.now() + (data.expires_in - 60) * 1000;

	if (data.refresh_token && data.refresh_token !== plain) {
		// Compare-and-set: only persist the rotation if nobody else already did,
		// so a concurrent refresh can't clobber the newest token.
		await db
			.update(oauthToken)
			.set({ refreshToken: encrypt(data.refresh_token), updatedAt: new Date() })
			.where(and(eq(oauthToken.provider, PROVIDER), eq(oauthToken.refreshToken, stored)))
			.returning({ provider: oauthToken.provider });
	}
}

export async function refreshAccessToken(): Promise<void> {
	if (inFlight) return inFlight;
	inFlight = doRefresh().finally(() => {
		inFlight = null;
	});
	return inFlight;
}

export function clearTokenCache(): void {
	accessToken = null;
	expiresAt = null;
}
