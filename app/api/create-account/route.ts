import { create } from '@/lib/controller/user';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const token = body.token as string;
		await create(body, token);
		return new Response('ok');
	} catch (e) {
		const statusText = e instanceof Error ? e.message : (e as string);
		return new Response('error', { status: 500, statusText });
	}
}
