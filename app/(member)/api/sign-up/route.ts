import { buildClient, ApiError } from '@datocms/cma-client';
import { Member, AuthUser } from '@/types/datocms-cma';
import { schema } from '@/components/forms/sign-up/schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const environment = process.env.DATOCMS_ENVIRONMENT;
const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN as string,
	environment,
});

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as z.infer<typeof schema>;
		console.log('save', body);

		try {
			schema.parse(body);
		} catch (error) {
			if (error instanceof z.ZodError) throw new Error(JSON.stringify(error.issues));
			else throw error;
		}

		throw new Error('Not implemented');

		const itemTypes = await client.itemTypes.list();
		const memberTypeId = itemTypes.find(({ api_key }) => api_key === 'member')?.id;

		Object.keys(body).forEach((key) => {
			const k = key as keyof typeof body;
			if (body[k] === undefined || body[k] === '') {
				delete body[k];
			}
		});

		const data = body;

		return new Response('ok');
	} catch (e) {
		let message: string;
		console.error(JSON.stringify(e));
		if (e instanceof ApiError) {
			message = JSON.stringify((e as ApiError).errors);
		} else message = typeof e === 'string' ? e : (e as Error).message;
		const statusText = message;
		return new Response('error', { status: 500, statusText });
	}
}
