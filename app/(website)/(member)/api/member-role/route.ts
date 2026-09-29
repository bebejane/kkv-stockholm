import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controllers/member';
import { parseItemWebhook } from '@/lib/webhook';
import { errorResponse, BadRequestError, NotFoundError } from '@/lib/errors';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const { entity } = parseItemWebhook(body, {
				eventTypes: ['create', 'update', 'publish', 'unpublish'],
			});

			const member = await memberController.find(entity.id);
			if (!member) throw new NotFoundError('Member', entity.id);

			const userId = member.user;
			if (!userId) throw new BadRequestError('Invalid userId');

			const role = member.administrator === true ? 'admin' : 'user';
			await memberController.updateUserRole(userId, role);

			return new Response(JSON.stringify({ role, member }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			return errorResponse(e);
		}
	});
}
