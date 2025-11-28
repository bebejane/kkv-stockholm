import { isAfter } from 'date-fns';
import { z, uuid, structuredText, slug, email, isoDateTime, image } from './base';

export const courseSchema = z
	.object({
		id: uuid,
		title: z.string().min(2, { error: 'Titel är obligatoriskt' }),
		image,
		about: structuredText,
		target_group: structuredText,
		goal: structuredText,
		included: z.string().optional(),
		workshop: uuid,
		member: uuid,
		about_organizer: structuredText,
		organizer_link: z
			.url({ error: 'Url är ogiltig' })
			.or(z.literal(''))
			.transform((url) => url || undefined),
		start: isoDateTime,
		end: isoDateTime,
		amount: z.coerce.number().positive().or(z.string().optional()),
		price: z.coerce.number().positive(),
		language: z.string().optional(),
		slug,
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({ code: 'custom', error: 'Startdatum måste vara före slutdatum', path: ['start'] });
	});

export const courseCreateSchema = courseSchema
	.omit({
		id: true,
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({ code: 'custom', error: 'Startdatum måste vara före slutdatum', path: ['start'] });
	});

export const courseCreateFormSchema = courseSchema
	.omit({
		id: true,
		slug: true,
		member: true,
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({ code: 'custom', error: 'Startdatum måste vara före slutdatum', path: ['start'] });
	});

export const courseUpdateSchema = courseCreateSchema;
export const courseUpdateFormSchema = courseCreateFormSchema;

export const signUpToCourseSchema = z.object({
	first_name: z.string().min(2, { error: 'Förnamn är obligatoriskt' }),
	last_name: z.string().min(2, { error: 'Efternamn är obligatoriskt' }),
	email: email,
	phone: z.string().min(8, { error: 'Telefonnummer är obligatoriskt' }),
	address: z.string(),
	postal_code: z.string(),
	city: z.string(),
	member: z.boolean(),
	course_id: uuid,
});
