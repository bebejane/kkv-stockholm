import { SpirisTokenResponse } from './types';

let accessToken: string | null = null;
let expiresAt: number | null = null;

export async function getAccessToken(): Promise<string> {
	if (accessToken && expiresAt && Date.now() < expiresAt) {
		return accessToken;
	}

	await refreshAccessToken();
	return accessToken!;
}

export async function refreshAccessToken(): Promise<void> {
	const clientId = process.env.SPIRIS_CLIENT_ID;
	const clientSecret = process.env.SPIRIS_CLIENT_SECRET;
	const refreshToken = process.env.SPIRIS_REFRESH_TOKEN;

	if (!clientId || !clientSecret || !refreshToken) {
		throw new Error(
			'Spiris credentials not configured. Set SPIRIS_CLIENT_ID, SPIRIS_CLIENT_SECRET, and SPIRIS_REFRESH_TOKEN in .env',
		);
	}

	const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

	const response = await fetch('https://identity.vismaonline.com/connect/token', {
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

	const data: SpirisTokenResponse = await response.json();

	accessToken = data.access_token;
	expiresAt = Date.now() + (data.expires_in - 60) * 1000;

	if (data.refresh_token && data.refresh_token !== refreshToken) {
		process.env.SPIRIS_REFRESH_TOKEN = data.refresh_token;
	}
}

export function clearTokenCache(): void {
	accessToken = null;
	expiresAt = null;
}
