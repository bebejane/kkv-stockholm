import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controllers/member';
import { parseErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const memberId = body?.entity?.id;

			if (!memberId) throw new Error('Update role user: Invalid memberId');
			const member = await memberController.find(memberId);
			if (!member) throw new Error('Update role user: Invalid memberId');
			const userId = member.user;
			if (!userId) throw new Error('Update role user: Invalid userId');
			const role = member.administrator === true ? 'admin' : 'user';
			await memberController.updateUserRole(userId, role);

			return new Response(JSON.stringify({ role, member }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			const statusText = parseErrorMessage(e);
			return new Response('error', { status: 500, statusText });
		}
	});
}
