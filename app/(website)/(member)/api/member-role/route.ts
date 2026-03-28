import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controllers/member';
import { parseErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		console.log('jhej');
		try {
			const body = await req.json();
			const eventType = body?.event_type;
			const memberId = body?.entity?.id;

			if (!memberId) throw new Error('Update role user: Invalid memberId');
			const member = await memberController.find(memberId);
			if (!member) throw new Error('Update role user: Invalid memberId');

			const role = member.administrator === true ? 'admin' : 'user';
			const user = await memberController.updateUserRole(memberId, role);

			return new Response(JSON.stringify({ role, user }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			const statusText = parseErrorMessage(e);
			return new Response('error', { status: 500, statusText });
		}
	});
}
