import { signUp } from '@/lib/controllers/course';
import { getErrorMessage } from '@/lib/utils';

export async function POST(req: Request) {
	try {
		const data = await req.json();
		const course = await signUp(data);
		return new Response('ok');
	} catch (e) {
		const statusText = getErrorMessage(e);
		return new Response('error', { status: 500, statusText });
	}
}
