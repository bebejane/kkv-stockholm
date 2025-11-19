import { basicAuth } from 'next-dato-utils/route-handlers';
import { getMember, getMemberById, handleMemberChange, MemberStatus } from '@/lib/controller/member';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			console.log('hej');
			const body = await req.json();
			console.log(body);
			const member_id = body?.entity?.id;
			const member = await getMemberById(member_id);
			if (!member) return new Response('error', { status: 400, statusText: 'invalid request' });
			await handleMemberChange(member.email as string);
			return new Response('ok', { status: 200 });
		} catch (e) {
			const statusText = e instanceof Error ? e.message : (e as string);
			return new Response('error', { status: 500, statusText });
		}
	});
}
