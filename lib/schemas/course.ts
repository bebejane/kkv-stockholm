import { isAfter } from 'date-fns';
import { z, uuid, structuredText, slug, email, isoDateTime, image, uuidNullable } from './base';

export const courseSchema = z
	.object({
		id: uuidNullable,
		title: z.string().min(2, { error: 'Titel är obligatoriskt' }),
		image,
		intro: structuredText,
		about: structuredText,
		preparation: structuredText,
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
		price: z.coerce.number({ error: 'Pris är obligatoriskt' }).positive().or(z.string().optional()),
		language: z.string().optional(),
		slug,
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({
				code: 'custom',
				error: 'Startdatum måste vara före slutdatum',
				path: ['start'],
			});
	});

export const courseCreateSchema = courseSchema;

export const courseCreateFormSchema = courseSchema;
z.object({
	title: z.string().min(2, { error: 'Titel är obligatoriskt' }),
	image,
	intro: structuredText,
	about: structuredText,
	preparation: structuredText,
	target_group: structuredText,
	goal: structuredText,
	included: z.string().optional(),
	workshop: uuid,
	about_organizer: structuredText,
	organizer_link: z
		.url({ error: 'Url är ogiltig' })
		.or(z.literal(''))
		.transform((url) => url || undefined),
	start: isoDateTime,
	end: isoDateTime,
	amount: z.coerce.number().positive().or(z.string().optional()),
	price: z.coerce.number({ error: 'Pris är obligatoriskt' }).positive().or(z.string().optional()),
	language: z.string().optional(),
}).superRefine((data, ctx) => {
	if (isAfter(new Date(data.start), new Date(data.end)))
		ctx.addIssue({
			code: 'custom',
			error: 'Startdatum måste vara före slutdatum',
			path: ['start'],
		});
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
