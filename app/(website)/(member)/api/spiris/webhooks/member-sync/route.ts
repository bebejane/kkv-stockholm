import * as spirisController from '@/lib/controllers/spiris';
import { parseErrorMessage } from '@/lib/utils';

function verifyBasicAuth(request: Request): boolean {
	const authHeader = request.headers.get('authorization');
	if (!authHeader || !authHeader.startsWith('Basic ')) {
		return false;
	}

	const user = process.env.BASIC_AUTH_USER;
	const pass = process.env.BASIC_AUTH_PASSWORD;
	if (!user || !pass) {
		return false;
	}

	const encoded = Buffer.from(`${user}:${pass}`).toString('base64');
	return authHeader === `Basic ${encoded}`;
}

export async function POST(request: Request) {
	try {
		if (!verifyBasicAuth(request)) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const body = await request.json();
		const entityId = body?.entity?.id || body?.item_id || body?.data?.id;

		if (!entityId) {
			return new Response(JSON.stringify({ error: 'Invalid webhook payload' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const result = await spirisController.ensureSpirisCustomer(entityId);

		return new Response(
			JSON.stringify({ received: true, updated: result.updated }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch (e) {
		const statusText = parseErrorMessage(e);
		return new Response(JSON.stringify({ error: statusText }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
