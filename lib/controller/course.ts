import { client } from '@/lib/client';
import { Item } from '@/lib/client';
import { Course } from '@/types/datocms';
import { sendSignUpToCourseEmail } from '@/lib/controller/email';
import { z, ZodError } from 'zod/v4';
import {
	courseCreateInputSchema,
	courseCreateSchema,
	courseUpdateInputSchema,
	courseUpdateSchema,
	signUpToCourseSchema,
} from '@/lib/schemas';
import { getItemTypeIds } from '@/lib/controller/utils';
import { htmlToStructuredText } from 'datocms-html-to-structured-text';

export type CourseType = Item<Course>;

export async function create(data: Partial<CourseType>): Promise<CourseType> {
	try {
		if (data.id) return await update(data.id, data);

		const { course: courseTypeId } = await getItemTypeIds(['course']);
		const newCourseInputData = courseCreateInputSchema.parse(data);
		const intro = await htmlToStructuredText(newCourseInputData.intro);
		const newCourseData = courseCreateSchema.parse({ ...newCourseInputData, intro });
		const course = await client.items.create<Course>({
			item_type: {
				id: courseTypeId as Course['itemTypeId'],
				type: 'item_type',
			},
			...newCourseData,
		});

		return course;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		console.log(JSON.stringify(e, null, 2));
		throw e;
	}
}

export async function update(id: string, data: Partial<CourseType>): Promise<CourseType> {
	if (!id) throw new Error('Course Id is required');
	if (!data) throw new Error('Course data is required');

	try {
		const updatedCourseInputData = courseUpdateInputSchema.parse(data);
		const intro = await htmlToStructuredText(updatedCourseInputData.intro);
		const updatedCourseData = courseUpdateSchema.parse({ ...updatedCourseInputData, intro });
		const course = await client.items.update<Course>(id, updatedCourseData);

		return course;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		throw e;
	}
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new Error('Course Id is required');
	try {
		await client.items.destroy(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export async function find(id: string): Promise<CourseType | null> {
	if (!id) return null;
	const course = await client.items.find<Course>(id);
	return course ?? null;
}

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
