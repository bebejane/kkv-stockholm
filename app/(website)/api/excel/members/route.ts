import { getDatoPluginSession, unauthorized } from '@/lib/dato-plugin-auth';
import { generateMembersList } from '@/lib/controllers/member';
import { errorResponse } from '@/lib/errors';

export async function GET(req: Request) {
	const session = await getDatoPluginSession(req);
	if (!session) return unauthorized();

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
