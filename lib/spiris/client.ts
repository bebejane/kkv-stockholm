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
			const errorBody = await parseErrorBody(retryResponse);
			throw new SpirisApiError(
				retryResponse.status,
				errorBody?.DeveloperErrorMessage ?? `Spiris API error: ${retryResponse.statusText}`,
				String(errorBody?.ErrorCode ?? ''),
				errorBody?.Errors,
			);
		}

		return readBody<T>(retryResponse);
	}

	if (!response.ok) {
		const errorBody = await parseErrorBody(response);
		throw new SpirisApiError(
			response.status,
			errorBody?.DeveloperErrorMessage ?? `Spiris API error: ${response.statusText}`,
			String(errorBody?.ErrorCode ?? ''),
			errorBody?.Errors,
		);
	}

	return readBody<T>(response);
}

async function readBody<T>(response: Response): Promise<T> {
	const text = await response.text();
	if (!text.trim()) return undefined as T;
	return JSON.parse(text) as T;
}

async function parseErrorBody(response: Response): Promise<SpirisError | null> {
	const text = await response.text();
	if (!text.trim()) return null;
	return JSON.parse(text) as SpirisError;
}
