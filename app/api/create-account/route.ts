import { createUser } from '@/lib/controller/member';
import { getErrorMessage } from '@/lib/utils';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const token = body.token as string;
		await createUser(body, token);
		return new Response('ok');
	} catch (e) {
		const statusText = getErrorMessage(e);
		return new Response('error', { status: 500, statusText });
	}
}
