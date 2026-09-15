import * as spirisController from '@/lib/controllers/spiris';
import { errorResponse } from '@/lib/errors';
import { basicAuth } from 'next-dato-utils/route-handlers';

export async function POST(request: Request) {
	return basicAuth(request, async () => {
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

			return new Response(JSON.stringify({ received: true, updated: result.updated }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			return errorResponse(e);
		}
	});
}
