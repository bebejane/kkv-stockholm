import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controllers/member';
import { parseErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const eventType = body?.event_type;
			const memberId = body?.entity?.id;
			const userId = body?.entity?.attributes?.user;

			if (eventType !== 'delete') throw new Error('Delete user: Invalid event type');
			if (!userId) throw new Error('Delete user: Invalid usedId');
			await memberController.removeUser(userId);
			return new Response(JSON.stringify({ deleted: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			const statusText = parseErrorMessage(e);
			return new Response('error', { status: 500, statusText });
		}
	});
}
