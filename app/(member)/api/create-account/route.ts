import { ApiError } from '@datocms/cma-client';
import { APIError } from 'better-auth';
import { createUser } from '@/lib/controller/user';

export async function POST(req: Request) {
	try {
		console.log('create account api route');
		const body = await req.json();
		const token = body.token as string;
		await createUser(body, token);
		return new Response('ok');
	} catch (e) {
		const statusText = e instanceof Error ? e.message : (e as string);
		return new Response('error', { status: 500, statusText });
	}
}
