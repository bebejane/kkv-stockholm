import { signUp } from '@/lib/controllers/course';
import { errorResponse } from '@/lib/errors';

export async function POST(req: Request) {
	try {
		const data = await req.json();
		const course = await signUp(data);
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		return errorResponse(e);
	}
}
