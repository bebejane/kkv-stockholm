import { getAdminApiSession } from '@/auth/utils';
import { generateMembersList } from '@/lib/controllers/member';

export async function GET(req: Request) {
	const session = await getAdminApiSession();
	if (!session) return new Response('unauthorized', { status: 401 });

	try {
		const buffer = await generateMembersList();
		return new Response(buffer as BodyInit, {
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': 'attachment; filename="medlemmar.xlsx"',
			},
		});
	} catch (e) {
		console.error('excel/members failed', e);
		return new Response('error', { status: 500 });
	}
}
