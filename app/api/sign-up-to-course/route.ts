import { buildClient, ApiError } from '@datocms/cma-client';
import { signUpToCourseSchema } from '@/lib/schemas';
import { includes, z } from 'zod';
import { Course } from '@/types/schema';

const environment = process.env.DATOCMS_ENVIRONMENT;
const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN as string,
	environment,
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		console.log('save', body);

		try {
			signUpToCourseSchema.parse(body);
		} catch (error) {
			if (error instanceof z.ZodError) throw new Error(JSON.stringify(error.issues));
			else throw error;
		}

		const course = (
			await client.items.list<Course>({
				page: {
					limit: 1,
				},
				filter: {
					type: 'course',
					fields: {
						id: { eq: body.course_id },
					},
				},
			})
		)[0];

		if (!course) throw new Error('Course not found');

		console.log(body);
		console.log('send email');

		return new Response('ok');
	} catch (e) {
		console.error(JSON.stringify(e));

		let message: string;

		message = typeof e === 'string' ? e : (e as Error).message;

		const statusText = message;
		return new Response('error', { status: 500, statusText });
	}
}
