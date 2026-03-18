import { createUser } from '@/lib/controllers/member';
import { parseErrorMessage } from '@/lib/utils';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const token = body.token as string;
		await createUser(body, token);
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		const statusText = parseErrorMessage(e);
		return new Response('error', { status: 500, statusText });
	}
}
