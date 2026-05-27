import 'dotenv/config';

const CLIENT_ID = process.env.SPIRIS_CLIENT_ID;
const CLIENT_SECRET = process.env.SPIRIS_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPIRIS_REDIRECT_URI || 'http://localhost:3000/api/spiris/auth/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
	console.error('Missing SPIRIS_CLIENT_ID or SPIRIS_CLIENT_SECRET in .env');
	process.exit(1);
}

const SCOPES = ['ea:api', 'offline_access', 'ea:sales'];

async function main() {
	console.log('\n=== Visma Spiris OAuth Token Setup ===\n');

	const authorizeUrl = `https://identity.vismaonline.com/connect/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES.join('%20')}&response_type=code&prompt=select_account`;

	console.log('Step 1: Open this URL in your browser:');
	console.log('\n' + authorizeUrl + '\n');
	console.log('Log in with your Visma Online sandbox account and grant access.');
	console.log('You will be redirected to a URL containing "?code=...".\n');
	console.log('Step 2: Paste the full redirect URL (or just the code parameter) below:\n');

	const readline = (await import('readline')).default;
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const code = await new Promise<string>((resolve) => {
		rl.question('> ', (input) => {
			const match = input.match(/[?&]code=([^&]+)/);
			resolve(match ? match[1] : input.trim());
			rl.close();
		});
	});

	if (!code) {
		console.error('No code provided');
		process.exit(1);
	}

	console.log('\nExchanging code for tokens...\n');

	const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

	const response = await fetch('https://identity.vismaonline.com/connect/token', {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${basicAuth}`,
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: REDIRECT_URI,
		}),
	});

	if (!response.ok) {
		const text = await response.text();
		console.error(`Token exchange failed (${response.status}): ${text}`);
		process.exit(1);
	}

	const data = await response.json();

	console.log('=== SUCCESS ===\n');
	console.log('Add this to your .env file:\n');
	console.log(`SPIRIS_CLIENT_ID=${CLIENT_ID}`);
	console.log(`SPIRIS_CLIENT_SECRET=${CLIENT_SECRET}`);
	console.log(`SPIRIS_REFRESH_TOKEN=${data.refresh_token}`);
	console.log('');
	console.log(`Access token (expires in ${data.expires_in}s) has been cached in memory.`);
	console.log('The refresh token above will be used to automatically get new access tokens.');
}

main().catch(console.error);
