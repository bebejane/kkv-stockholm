import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controllers/member';
import { parseItemWebhook } from '@/lib/webhook';
import { errorResponse, NotFoundError } from '@/lib/errors';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const { entity, previousAttributes } = parseItemWebhook(body, {
				eventTypes: ['create', 'update'],
			});

			const member = await memberController.find(entity.id);
			if (!member) throw new NotFoundError('Member', entity.id);

			const status = await memberController.handleMemberChange(member.email as string, {
				previous: previousAttributes,
			});
			return new Response(JSON.stringify({ status: status, member: member.email }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			return errorResponse(e);
		}
	});
}
