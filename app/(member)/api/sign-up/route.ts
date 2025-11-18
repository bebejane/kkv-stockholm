import { buildClient, ApiError, ItemTypeDefinition } from '@datocms/cma-client';
import { auth } from '@/auth';
import { Member, AuthUser } from '@/types/datocms-cma';
import { schema } from '@/components/forms/sign-up/schema';
import { revalidatePath } from 'next/cache';
import { includes, z } from 'zod';
import { APIError } from 'better-auth';

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

		console.log(body);

		const { user } = await auth.api.signUpEmail({
			body: {
				email: body.email,
				password: body.password,
				name: `${body.first_name} ${body.last_name}`,
			},
		});

		const itemTypes = await client.itemTypes.list();
		const memberTypeId = itemTypes.find(({ api_key }) => api_key === 'member')?.id;

		if (!memberTypeId) throw new Error('Member type not found');

		const invalidKeys = [undefined, null, '', 'password', 'password_confirmation'];

		Object.keys(body).forEach((key) => {
			const k = key as keyof typeof body;
			if (body[k] === undefined || body[k] === '' || invalidKeys.includes(k)) delete body[k];
		});

		const data = {
			...body,
			user: user.id,
		};

		await client.items.create<Member>({
			item_type: {
				//@ts-ignore
				id: memberTypeId,
				type: 'item_type',
			},
			...data,
		});

		return new Response('ok');
	} catch (e) {
		console.error(JSON.stringify(e));

		let message: string;

		if (e instanceof APIError) {
			message = e.message;
		} else if (e instanceof ApiError) {
			message = JSON.stringify((e as ApiError).errors);
		} else {
			message = typeof e === 'string' ? e : (e as Error).message;
		}

		const statusText = message;
		return new Response('error', { status: 500, statusText });
	}
}
