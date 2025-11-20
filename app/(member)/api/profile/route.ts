import { getMemberByEmail, updateMember } from '@/lib/controller/member';
import { getSession } from '@/auth/utils';

export async function POST(req: Request) {
	try {
		const session = await getSession();
		const member = await getMemberByEmail(session.user.email);

		if (!member) throw new Error('Member not found');

		const data = await req.json();
		console.log(data);
		const updatedMember = await updateMember(member.id, data);

		return new Response(JSON.stringify(updatedMember), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		const statusText = e instanceof Error ? e.message : (e as string);
		return new Response('error', { status: 500, statusText });
	}
}
