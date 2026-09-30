import * as spirisController from '@/lib/controllers/spiris';
import { parseItemWebhook } from '@/lib/webhook';
import { errorResponse } from '@/lib/errors';
import { basicAuth } from 'next-dato-utils/route-handlers';

export async function POST(request: Request) {
	return basicAuth(request, async () => {
		try {
			const body = await request.json();
			const { entity } = parseItemWebhook(body, {
				eventTypes: ['create', 'update'],
			});

			const result = await spirisController.ensureSpirisCustomer(entity.id);

			return new Response(JSON.stringify({ received: true, updated: result.updated }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			return errorResponse(e);
		}
	});
}
