import { createUser } from '@/lib/controllers/member';
import { parseErrorMessage } from '@/lib/utils';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const token = body.token as string;
		await createUser(body, token);
		return new Response('ok');
	} catch (e) {
		const statusText = parseErrorMessage(e);
		return new Response('error', { status: 500, statusText });
	}
}
