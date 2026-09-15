import { getAdminApiSession } from '@/auth/utils';
import { generateMembersList } from '@/lib/controllers/member';
import { errorResponse } from '@/lib/errors';

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
		return errorResponse(e);
	}
}
