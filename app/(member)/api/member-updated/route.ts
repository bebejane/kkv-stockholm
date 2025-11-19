import { basicAuth } from 'next-dato-utils/route-handlers';
import { getMember, handleMemberStatusChange, MemberStatus } from '@/lib/controller/member';

export async function POST(req: Request) {
	return basicAuth(req, async (req: Request) => {
		try {
			const body = await req.json();
			const member_id = body?.entity?.id;
			const member = await getMember(member_id);
			if (!member) return new Response('error', { status: 400, statusText: 'invalid request' });
			await handleMemberStatusChange(member.email as string, member.member_status as MemberStatus);
			return new Response('ok', { status: 200 });
		} catch (e) {
			const statusText = e instanceof Error ? e.message : (e as string);
			return new Response('error', { status: 500, statusText });
		}
	});
}
