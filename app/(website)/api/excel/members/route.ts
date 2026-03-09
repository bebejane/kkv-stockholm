import { generateMembersList } from '@/lib/controllers/member';
import { parseErrorMessage } from '@/lib/utils';

export async function GET(req: Request) {
	try {
		const buffer = await generateMembersList();
		return new Response(buffer as BodyInit, {
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			},
		});
	} catch (e) {
		const statusText = parseErrorMessage(e);
		return new Response('error', { status: 500, statusText });
	}
}
