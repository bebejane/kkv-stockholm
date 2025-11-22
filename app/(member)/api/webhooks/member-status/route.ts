import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controller/member';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const member_id = body?.entity?.id;
			const member = await memberController.find(member_id);
			if (!member) return new Response('error', { status: 400, statusText: 'invalid request' });
			await memberController.handleMemberChange(member.email as string);
			return new Response('ok', { status: 200 });
		} catch (e) {
			const statusText = e instanceof Error ? e.message : (e as string);
			return new Response('error', { status: 500, statusText });
		}
	});
}
