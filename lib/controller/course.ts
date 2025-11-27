import { client } from '@/lib/client';
import { Item } from '@/lib/client';
import { Course } from '@/types/datocms';
import { sendSignUpToCourseEmail } from '@/lib/controller/email';
import { z, ZodError } from 'zod/v4';
import { courseCreateSchema, courseUpdateSchema, signUpToCourseSchema } from '@/lib/schemas';
import { generateSlug, getItemTypeIds } from '@/lib/controller/utils';
import { Upload } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { getMemberSession } from '@/auth/utils';

export type CourseType = Item<Course>;
export type CourseTypeWithImage = Omit<CourseType, 'image'> & { image: Upload | null };

export async function create(data: Partial<CourseType>): Promise<CourseType> {
	if (data.id) return await update(data.id, data);

	const { member } = await getMemberSession();
	const { course: courseTypeId } = await getItemTypeIds(['course']);
	const newCourseData = courseCreateSchema.parse({
		...data,
		member: member.id,
		slug: await generateSlug(data.title as string, 'slug', courseTypeId),
	}) as any;

	console.log('new course', JSON.stringify(newCourseData, null, 2));
	const course = await client.items.create<Course>({
		item_type: {
			id: courseTypeId as Course['itemTypeId'],
			type: 'item_type',
		},
		...newCourseData,
	});

	return course;
}

export async function update(id: string, data: Partial<CourseType>): Promise<CourseType> {
	if (!id) throw new Error('Course Id is required');
	if (!data) throw new Error('Course data is required');

	const updatedCourseData = courseUpdateSchema.parse(data) as any;
	const course = await client.items.update<Course>(id, updatedCourseData);
	return course;
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new Error('Course Id is required');
	await client.items.destroy(id);
}

export async function find(id: string): Promise<CourseTypeWithImage | null> {
	if (!id) return null;
	const course = await client.items.find<Course>(id);
	const image = course.image?.upload_id ? await client.uploads.find(course.image?.upload_id) : null;
	return course ? { ...course, image } : null;
}

export async function signUp(data: Partial<CourseType>): Promise<CourseType> {
	const newCourseData = signUpToCourseSchema.parse(data);
	const course = (await find(newCourseData.course_id)) as CourseType;
	if (!course) throw new Error('Course not found');

	await sendSignUpToCourseEmail({
		name: newCourseData.first_name,
		email: newCourseData.email as string,
		course,
	});

	return course;
}
