import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controllers/member';
import { errorResponse, BadRequestError } from '@/lib/errors';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const eventType = body?.event_type;
			const memberId = body?.entity?.id;
			const userId = body?.entity?.attributes?.user;

			if (eventType !== 'delete') throw new BadRequestError('Invalid event type');
			if (!userId) throw new BadRequestError('Invalid userId');
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
