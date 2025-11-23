import { signUp } from '@/lib/controller/course';

export async function POST(req: Request) {
	try {
		const data = await req.json();
		const course = await signUp(data);
		return new Response('ok');
	} catch (e) {
		const statusText = e instanceof Error ? e.message : (e as string);
		return new Response('error', { status: 500, statusText });
	}
}
