import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controllers/member';
import { parseErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const memberId = body?.entity?.id;
			const userId = body?.entity?.attributes?.user;
			const eventType = body?.event_type;

			if (eventType === 'delete') {
				if (userId) {
					await memberController.removeUser(userId);
					return new Response(JSON.stringify({ deleted: true }), {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					});
				} else throw new Error('Delete user: Invalid usedId');
			}

			const member = await memberController.find(memberId);
			if (!member) return new Response('error', { status: 400, statusText: 'Invalid request' });
			const status = await memberController.handleMemberChange(member.email as string);
			return new Response(JSON.stringify({ status: status, member: member.email }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			const statusText = parseErrorMessage(e);
			return new Response('error', { status: 500, statusText });
		}
	});
}
