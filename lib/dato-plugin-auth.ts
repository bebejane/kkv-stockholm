import { NextRequest } from 'next/server';

type DatoPluginUser = {
	id: string;
	email: string;
	full_name: string;
};

export type DatoPluginSession = {
	user: DatoPluginUser | null;
};

const HEADERS = {
	'Accept': 'application/json',
	'X-Api-Version': '3',
} as const;

const CMA_BASE = 'https://site-api.datocms.com';

/**
 * Id of the DatoCMS site this deployment belongs to. Resolved once from our own
 * full-access token and cached for the lifetime of the instance.
 */
let ownSiteId: string | null | undefined;

async function fetchCallerSiteId(token: string): Promise<string | null> {
	try {
		const res = await fetch(`${CMA_BASE}/site`, {
			headers: { Authorization: `Bearer ${token}`, ...HEADERS },
			cache: 'no-store',
		});
		if (!res.ok) return null;
		const { data } = (await res.json()) as { data?: { id?: string } };
		return data?.id ?? null;
	} catch {
		return null;
	}
}

async function getOwnSiteId(): Promise<string | null> {
	if (ownSiteId !== undefined) return ownSiteId;

	const token = process.env.DATOCMS_API_TOKEN;
	if (!token) {
		ownSiteId = null;
		return null;
	}

	ownSiteId = await fetchCallerSiteId(token);
	return ownSiteId;
}

async function verifyCurrentUserAccessToken(
	token: string,
): Promise<DatoPluginSession | null> {
	// A token is a generic user token usable against any project the user can
	// access, so we must confirm it belongs to *this* site before trusting it.
	const [siteId, expectedSiteId] = await Promise.all([
		fetchCallerSiteId(token),
		getOwnSiteId(),
	]);

	if (!siteId || !expectedSiteId || siteId !== expectedSiteId) return null;

	try {
		const res = await fetch(`${CMA_BASE}/users/me`, {
			headers: { Authorization: `Bearer ${token}`, ...HEADERS },
			cache: 'no-store',
		});
		if (res.ok) {
			const { data } = (await res.json()) as { data: DatoPluginUser };
			return { user: data };
		}

		// Account owners don't have a project user record but are already bound
		// to the site by the check above.
		return { user: null };
	} catch {
		return { user: null };
	}
}

export async function getDatoPluginSession(req: NextRequest | Request) {
	const authorization = req.headers.get('authorization');
	const token = authorization?.startsWith('Bearer ')
		? authorization.slice('Bearer '.length).trim()
		: null;

	if (!token) return null;

	return verifyCurrentUserAccessToken(token);
}

export function unauthorized() {
	return new Response('unauthorized', { status: 401 });
}
