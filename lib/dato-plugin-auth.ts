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

async function verifyCurrentUserAccessToken(
	token: string,
): Promise<DatoPluginSession | null> {
	try {
		const res = await fetch(`${CMA_BASE}/users/me`, {
			headers: { Authorization: `Bearer ${token}`, ...HEADERS },
			cache: 'no-store',
		});
		if (res.ok) {
			const { data } = (await res.json()) as { data: DatoPluginUser };
			return { user: data };
		}

		// Account owners don't have a project user record; fall back to site read
		const site = await fetch(`${CMA_BASE}/site`, {
			headers: { Authorization: `Bearer ${token}`, ...HEADERS },
			cache: 'no-store',
		});
		if (site.ok) return { user: null };

		return null;
	} catch {
		return null;
	}
}

export async function getDatoPluginSession(req: NextRequest | Request) {
	const authorization = req.headers.get('authorization');
	const token = authorization?.startsWith('Bearer ')
		? authorization.slice('Bearer '.length).trim()
		: null;

	if (!token) return null;

	const session = await verifyCurrentUserAccessToken(token);
	if (!session) return null;

	const allowed =
		process.env.DATOCMS_PLUGIN_ALLOWED_EMAILS ??
		process.env.NEXT_PUBLIC_DATOCMS_PLUGIN_ALLOWED_EMAILS;

	if (allowed && session.user?.email) {
		const emails = allowed.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
		if (!emails.includes(session.user.email.toLowerCase())) return null;
	}

	return session;
}

export function unauthorized() {
	return new Response('unauthorized', { status: 401 });
}
