import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controller/member';
import { getErrorMessage } from '@/lib/utils';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const member_id = body?.entity?.id;
			const member = await memberController.find(member_id);
			if (!member) return new Response('error', { status: 400, statusText: 'invalid request' });
			const status = await memberController.handleMemberChange(member.email as string);
			return new Response(JSON.stringify({ status: status, member: member.email }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			const statusText = getErrorMessage(e);
			return new Response('error', { status: 500, statusText });
		}
	});
}
