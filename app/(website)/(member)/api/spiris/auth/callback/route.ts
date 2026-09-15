import 'dotenv/config';
import { getAdminApiSession } from '@/auth/utils';

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function htmlResponse(html: string, status = 200): Response {
	return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(req: Request) {
	const session = await getAdminApiSession();
	if (!session)
		return htmlResponse(
			'<!DOCTYPE html><html><body><h1>Unauthorized</h1><p>Log in as admin before completing the authorization flow.</p></body></html>',
			401,
		);

	const url = new URL(req.url);
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');

	if (error) {
		return htmlResponse(
			`<!DOCTYPE html><html><body><h1>Authorization failed</h1><p>Error: ${escapeHtml(error)}</p></body></html>`,
			400,
		);
	}

	if (!code) {
		return htmlResponse(
			'<!DOCTYPE html><html><body><h1>Missing authorization code</h1><p>No code parameter received.</p></body></html>',
			400,
		);
	}

	const clientId = process.env.SPIRIS_CLIENT_ID;
	const clientSecret = process.env.SPIRIS_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		return htmlResponse(
			'<!DOCTYPE html><html><body><h1>Configuration error</h1><p>Spiris integration is not configured.</p></body></html>',
			500,
		);
	}

	const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

	try {
		const response = await fetch('https://identity.vismaonline.com/connect/token', {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${basicAuth}`,
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: `${url.origin}/api/spiris/auth/callback`,
			}),
		});

		if (!response.ok) {
			console.error('Spiris token exchange failed', response.status, await response.text());
			return htmlResponse(
				'<!DOCTYPE html><html><body><h1>Token exchange failed</h1><p>The token exchange failed. Check the server logs for details.</p></body></html>',
				500,
			);
		}

		const data = await response.json();

		const html = `
<!DOCTYPE html>
<html>
<head><title>Spiris Auth Success</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 40px auto;">
<h1>Spiris OAuth Setup Complete</h1>
<p>Add this to your <code>.env</code> file:</p>
<pre style="background: #f4f4f4; padding: 16px; border-radius: 4px; overflow-x: auto;">
SPIRIS_REFRESH_TOKEN=${escapeHtml(data.refresh_token ?? '')}
</pre>
<p>The refresh token above will be used to automatically get new access tokens.</p>
<p>You can close this tab.</p>
</body>
</html>`;

		return htmlResponse(html);
	} catch (e) {
		console.error('Spiris auth callback error', e);
		return htmlResponse(
			'<!DOCTYPE html><html><body><h1>Error</h1><p>An unexpected error occurred. Check the server logs for details.</p></body></html>',
			500,
		);
	}
}
