import { NextResponse } from 'next/server';

// For redirecting user after expired login
export function proxy(request: Request) {
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-url', request.url);

	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	return response;
}

export const config = {
	matcher: ['/medlem', '/medlem/:path*'],
};
