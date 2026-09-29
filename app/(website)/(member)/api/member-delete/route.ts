import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controllers/member';
import { parseItemWebhook } from '@/lib/webhook';
import { errorResponse, BadRequestError, ForbiddenError } from '@/lib/errors';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const { entity } = parseItemWebhook(body, { eventTypes: ['delete'] });

			// The member record is already gone by the time a delete webhook
			// fires, so verify the user against the e-mail carried in the payload.
			const userId = entity.attributes.user;
			const email = entity.attributes.email;
			if (typeof userId !== 'string' || !userId)
				throw new BadRequestError('Invalid webhook payload');
			if (typeof email !== 'string' || !email)
				throw new BadRequestError('Invalid webhook payload');

			const user = await memberController.findUser(userId);
			if (!user) throw new BadRequestError('User not found');
			if (user.email !== email)
				throw new ForbiddenError('User does not match the deleted member');

			await memberController.removeUser(userId);
			return new Response(JSON.stringify({ deleted: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			return errorResponse(e);
		}
	});
}
