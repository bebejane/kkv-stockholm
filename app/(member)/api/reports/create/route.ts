import { getMemberByEmail, updateMember } from '@/lib/controller/member';
import { getSession } from '@/auth/utils';
import { createReport } from '@/lib/controller/report';

export async function POST(req: Request) {
	try {
		console.log('create report');
		const session = await getSession();
		const member = await getMemberByEmail(session.user.email);

		if (!member) throw new Error('Member not found');

		const data = await req.json();
		const newReport = await createReport(member.id, data);

		return new Response(JSON.stringify(newReport), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.log(e);
		const statusText = e instanceof Error ? e.message : (e as string);
		return new Response('error', { status: 500, statusText });
	}
}
