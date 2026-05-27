import * as spirisController from '@/lib/controllers/spiris';
import { parseErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	try {
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
