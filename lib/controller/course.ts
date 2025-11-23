import { client } from '@/lib/client';
import { Item } from '@/lib/client';
import { Course } from '@/types/datocms';
import { sendSignUpToCourseEmail } from '@/lib/controller/email';
import { z } from 'zod/v4';
import { signUpToCourseSchema } from '@/lib/schemas';

export type CourseType = Item<Course>;

export async function signUp(data: Partial<CourseType>): Promise<CourseType> {
	try {
		const newCourseData = signUpToCourseSchema.parse(data);
		const course = await find(newCourseData.course_id);
		if (!course) throw new Error('Course not found');

		await sendSignUpToCourseEmail({
			name: newCourseData.first_name,
			email: newCourseData.email as string,
			course,
		});

		return course;
	} catch (error) {
		if (error instanceof z.ZodError) throw new Error(JSON.stringify(error.issues));
		else throw error;
	}
}

export async function find(id: string): Promise<CourseType | null> {
	if (!id) return null;
	const course = (
		await client.items.list<Course>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'course',
				fields: {
					id: { eq: id },
				},
			},
		})
	)?.[0];

	return course ?? null;
}
