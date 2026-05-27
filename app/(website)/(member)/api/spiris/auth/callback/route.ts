import 'dotenv/config';

export async function GET(req: Request) {
	const url = new URL(req.url);
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');

	if (error) {
		return new Response(
			`<html><body><h1>Authorization failed</h1><p>Error: ${error}</p></body></html>`,
			{
				status: 400,
				headers: { 'Content-Type': 'text/html' },
			},
		);
	}

	if (!code) {
		return new Response(
			`<html><body><h1>Missing authorization code</h1><p>No code parameter received.</p></body></html>`,
			{
				status: 400,
				headers: { 'Content-Type': 'text/html' },
			},
		);
	}

	const clientId = process.env.SPIRIS_CLIENT_ID;
	const clientSecret = process.env.SPIRIS_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		return new Response(
			`<html><body><h1>Configuration error</h1><p>SPIRIS_CLIENT_ID or SPIRIS_CLIENT_SECRET not set.</p></body></html>`,
			{
				status: 500,
				headers: { 'Content-Type': 'text/html' },
			},
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
			const text = await response.text();
			return new Response(
				`<html><body><h1>Token exchange failed</h1><p>${response.status}: ${text}</p></body></html>`,
				{
					status: 500,
					headers: { 'Content-Type': 'text/html' },
				},
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
SPIRIS_CLIENT_ID=${clientId}
SPIRIS_CLIENT_SECRET=${clientSecret}
SPIRIS_REFRESH_TOKEN=${data.refresh_token}
</pre>
<p>The refresh token above will be used to automatically get new access tokens.</p>
<p>You can close this tab.</p>
</body>
</html>`;

		return new Response(html, {
			status: 200,
			headers: { 'Content-Type': 'text/html' },
		});
	} catch (e) {
		return new Response(
			`<html><body><h1>Error</h1><p>${e instanceof Error ? e.message : 'Unknown error'}</p></body></html>`,
			{
				status: 500,
				headers: { 'Content-Type': 'text/html' },
			},
		);
	}
}
