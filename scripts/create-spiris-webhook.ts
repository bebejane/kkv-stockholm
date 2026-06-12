import 'dotenv/config';

const DATOCMS_API_TOKEN = process.env.DATOCMS_API_TOKEN;
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

const WEBHOOK_URL = 'https://kkv-stockholm.vercel.app/api/spiris/webhooks/member-sync';
const MEMBER_ITEM_TYPE_ID = 'b44GORd_TmaheYg4z180PA';

if (!DATOCMS_API_TOKEN) {
	console.error('Missing DATOCMS_API_TOKEN in .env');
	process.exit(1);
}
if (!BASIC_AUTH_USER || !BASIC_AUTH_PASSWORD) {
	console.error('Missing BASIC_AUTH_USER or BASIC_AUTH_PASSWORD in .env');
	process.exit(1);
}

async function main() {
	console.log('Creating Spiris member-sync webhook in DatoCMS...\n');

	const response = await fetch('https://site-api.datocms.com/webhooks', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${DATOCMS_API_TOKEN}`,
			'Content-Type': 'application/vnd.api+json',
			Accept: 'application/json',
			'X-Api-Version': '3',
		},
		body: JSON.stringify({
			data: {
				type: 'webhook',
				attributes: {
					name: 'Spiris Member Sync',
					url: WEBHOOK_URL,
					events: [
						{
							entity_type: 'item',
							event: 'update',
							filter: {
								item_type: MEMBER_ITEM_TYPE_ID,
							},
						},
					],
					http_authentication: 'basic_auth',
					http_basic_user: BASIC_AUTH_USER,
					http_basic_password: BASIC_AUTH_PASSWORD,
				},
			},
		}),
	});

	const body = await response.json();

	if (!response.ok) {
		console.error(`Failed (${response.status}):`, JSON.stringify(body, null, 2));
		process.exit(1);
	}

	console.log('✅ Webhook created successfully!\n');
	console.log(`Name: ${body.data?.attributes?.name}`);
	console.log(`URL:  ${body.data?.attributes?.url}`);
	console.log(`ID:   ${body.data?.id}`);
}

main().catch(console.error);
