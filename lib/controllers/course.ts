import { client } from '@/lib/client';
import { Item } from '@/lib/client';
import { Course } from '@/types/datocms';
import { sendSignUpToCourseEmail } from '@/lib/controllers/email';
import { courseCreateSchema, courseUpdateSchema, signUpToCourseSchema } from '@/lib/schemas/course';
import { findById, generateSlug, getItemTypeIds } from '@/lib/controllers/utils';
import { getMemberSession } from '@/auth/utils';
import { BadRequestError, NotFoundError } from '@/lib/errors';
import { ErrorMessages } from '@/lib/error-messages';
import type { ApiTypes } from '@datocms/cma-client';

export type CourseType = Item<Course>;
export type CourseTypeWithImage = Omit<CourseType, 'image'> & { image: ApiTypes.Upload | null };

/** Normalises the schema's `{ upload_id } | string | null` image to the CMA input shape. */
function normalizeImage(value: unknown): { upload_id: string } | null {
	if (!value) return null;
	if (typeof value === 'string') return { upload_id: value };
	if (typeof value === 'object' && 'upload_id' in value)
		return { upload_id: (value as { upload_id: string }).upload_id };
	return null;
}

export async function create(data: Partial<CourseType>): Promise<CourseType> {
	const { member } = await getMemberSession();
	const { course: courseTypeId } = await getItemTypeIds(['course']);
	const { id: _id, image, ...newCourseData } = courseCreateSchema.parse({
		...data,
		member: member.id,
		slug: await generateSlug(data.title as string, 'slug', courseTypeId),
	});
	// The zod schema types structured-text fields as `string | DAST`, which is
	// looser than the CMA input type (DAST only). The values are passed through
	// unchanged; this cast only bridges the two type systems.
	const payload = {
		item_type: {
			id: courseTypeId as Course['itemTypeId'],
			type: 'item_type',
		},
		...newCourseData,
		image: normalizeImage(image),
	} as unknown as ApiTypes.ItemCreateSchema<Course>;

	const course = await client.items.create<Course>(payload);

	return course;
}

export async function update(id: string, data: Partial<CourseType>): Promise<CourseType> {
	if (!id) throw new BadRequestError(ErrorMessages.COURSE_ID_REQUIRED);
	if (!data) throw new BadRequestError(ErrorMessages.COURSE_DATA_REQUIRED);

	const { id: _id, image, ...updatedCourseData } = courseUpdateSchema.parse(
		data,
	) as Record<string, unknown>;
	const course = await client.items.update<Course>(id, {
		...updatedCourseData,
		image: normalizeImage(image),
	});
	return course;
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new BadRequestError(ErrorMessages.COURSE_ID_REQUIRED);
	await client.items.destroy(id);
}

export async function find(id: string): Promise<CourseTypeWithImage | null> {
	if (!id) return null;
	// Type-filtered so records of other models can't be read/edited/deleted
	// through the course routes.
	const course = await findById<CourseType>(id, 'course');
	if (!course) return null;

	const image = course.image?.upload_id ? await client.uploads.find(course.image.upload_id) : null;
	return { ...course, image };
}

export async function signUp(data: Partial<CourseType>): Promise<CourseType> {
	const newCourseData = signUpToCourseSchema.parse(data);
	const course = (await find(newCourseData.course_id)) as CourseType;
	if (!course) throw new NotFoundError('Course');

	await sendSignUpToCourseEmail({
		name: newCourseData.first_name,
		email: newCourseData.email as string,
		course,
	});

	return course;
}
