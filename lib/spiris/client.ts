import { getAccessToken } from './auth';
import { SpirisError } from './types';

const BASE_URL = 'https://eaccountingapi.vismaonline.com/v2';

export class SpirisApiError extends Error {
	constructor(
		public statusCode: number,
		message: string,
		public code?: string,
		public details?: unknown,
	) {
		super(message);
		this.name = 'SpirisApiError';
	}
}

export async function spirisFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const token = await getAccessToken();

	const url = `${BASE_URL}${path}`;

	const response = await fetch(url, {
		...options,
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
			...options.headers,
		},
	});

	if (response.status === 401) {
		const { refreshAccessToken, clearTokenCache } = await import('./auth');
		clearTokenCache();
		await refreshAccessToken();
		const newToken = await getAccessToken();

		const retryResponse = await fetch(url, {
			...options,
			headers: {
				'Authorization': `Bearer ${newToken}`,
				'Content-Type': 'application/json',
				...options.headers,
			},
		});

		if (!retryResponse.ok) {
			const errorBody = await retryResponse.json().catch(() => null) as SpirisError | null;
			throw new SpirisApiError(
				retryResponse.status,
				errorBody?.error?.message ?? `Spiris API error: ${retryResponse.statusText}`,
				errorBody?.error?.code,
				errorBody?.error?.details,
			);
		}

		return retryResponse.json();
	}

	if (!response.ok) {
		const errorBody = await response.json().catch(() => null) as SpirisError | null;
		throw new SpirisApiError(
			response.status,
			errorBody?.error?.message ?? `Spiris API error: ${response.statusText}`,
			errorBody?.error?.code,
			errorBody?.error?.details,
		);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}
