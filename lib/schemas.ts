import { z } from 'zod/v4';

export const uuidSchema = z
	.base64url()
	.refine((val) => /^[A-Za-z0-9_-]{22}$/.test(val), { message: 'Invalid Id: Wrong UUID format' });
export const uuidSchemaNullable = z.string().nullish().or(z.undefined()).or(uuidSchema);
export const slugSchema = z
	.string()
	.min(1, { message: 'Slug är obligatoriskt' })
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug är ogiltig' });

export const structuredTextSchema = z.object({
	schema: z.literal('dast'),
	document: z.object(),
});

export const passwordSchema = z.string().min(6, { message: 'Lösenord är obligatoriskt' });
export const emailSchema = z.email({ message: 'Ogiltig e-postadress' });
export const tokenSchema = z.string().min(128, { message: 'Token är ogiltig' });
export const memberSexSchema = z.literal(['man', 'woman', 'other'], { message: 'Kön är obligatoriskt' });
export const memberStatusSchema = z.literal(['PENDING', 'ACCEPTED', 'DECLINED', 'PAID', 'INACTIVE', 'ACTIVE'], {
	message: 'Status är obligatoriskt',
});

export const memberSchema = z.object({
	id: uuidSchema,
	first_name: z.string().min(2, { message: 'Förnamn är obligatoriskt' }),
	last_name: z.string().min(2, { message: 'Efternamn är obligatoriskt' }),
	email: z.email({ message: 'Ogiltig e-postadress' }),
	member_status: memberStatusSchema,
	phone: z.string().min(8, { message: 'Telefonnummer är obligatoriskt' }),
	phone_home: z.string(),
	sex: memberSexSchema,
	address: z.string().min(6, { message: 'Adress är obligatoriskt' }),
	postal_code: z.string().min(5, { message: 'Postnummer är obligatoriskt' }),
	city: z.string().min(2, { message: 'Stad är obligatoriskt' }),
	ssa: z.string().min(12, { message: 'Personnummer är obligatoriskt' }),
	compartment: z.string().optional(),
	card_number: z.string().optional(),
	workshops: z.array(z.string()),
	user: z.string().optional(),
	verification_token: tokenSchema,
});

export const memberSignUpSchema = memberSchema.omit({
	id: true,
	user: true,
	member_status: true,
	verification_token: true,
});

export const memberUpdateSchema = memberSchema.omit({
	id: true,
});

export const userSchema = z.object({
	id: uuidSchema,
	name: z.string(),
	email: emailSchema,
	email_verified_at: z.boolean(),
	image: z.object({
		url: z.string(),
	}),
	accounts: z.array(uuidSchema),
	sessions: z.array(uuidSchema),
	verfication_tokens: z.array(uuidSchema),
	role: z.literal(['user', 'admin']),
	banned: z.boolean(),
	ban_reason: z.string(),
	ban_expires: z.date(),
});

export const userCreateSchema = z
	.object({
		password: passwordSchema,
		password_confirmation: passwordSchema,
		token: tokenSchema,
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: 'Lösenorden matchar inte',
		path: ['password', 'password_confirmation'],
	});

export const userSignInSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const userRequestResetPasswordSchema = z.object({
	email: emailSchema,
});

export const userResetPasswordSchema = z
	.object({
		password: passwordSchema,
		password_confirmation: passwordSchema,
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: 'Lösenorden matchar inte',
		path: ['password', 'password_confirmation'],
	});

export const bookingSchema = z.object({
	id: uuidSchema,
	member: uuidSchema,
	booking: uuidSchema,
	workshop: uuidSchema,
	equipment: z.array(uuidSchema),
	start: z.iso.datetime(),
	end: z.iso.datetime(),
	note: z.string(),
	report: uuidSchema,
	reported: z.boolean(),
});

export const bookingCreateSchema = bookingSchema.omit({
	id: true,
	report: true,
	reported: true,
});

export const bookingUpdateSchema = bookingSchema.omit({
	id: true,
	member: true,
	workshop: true,
	equipment: true,
});

export const bookingSearchSchema = z.object({
	workshopId: uuidSchemaNullable,
	equipmentId: z.array(uuidSchema).optional(),
	start: z.iso.datetime(),
	end: z.iso.datetime(),
});

export const reportHoursSchema = z.coerce.number().min(0).max(5);
export const reportDaysSchema = z.coerce.number().min(0).max(365);
export const assistantsSchema = z.object({
	id: uuidSchema,
	hours: reportHoursSchema,
	days: reportDaysSchema,
});

export const reportSchema = z.object({
	id: uuidSchema,
	member: uuidSchemaNullable,
	booking: uuidSchemaNullable,
	workshop: uuidSchema,
	hours: reportHoursSchema,
	days: reportDaysSchema,
	extra_cost: z.coerce.number().optional(),
	date: z.iso.date(),
	assistants: z.array(assistantsSchema).optional(),
});

export const reportCreateSchema = reportSchema
	.omit({
		id: true,
	})
	.extend({
		assistants: z.array(assistantsSchema.omit({ id: true })).optional(),
	});

export const reportUpdateSchema = reportCreateSchema;

export const courseSchema = z.object({
	id: uuidSchema,
	title: z.string().min(2, { message: 'Titel är obligatoriskt' }),
	image: z.object({
		upload_id: uuidSchema,
	}),
	intro: structuredTextSchema,
	text_about: structuredTextSchema,
	text_target_group: structuredTextSchema,
	text_goal: structuredTextSchema,
	included: z.string().optional(),
	workshop: uuidSchema,
	member: uuidSchema,
	about_organizer: z.string().min(1, { message: 'Organisator är obligatoriskt' }),
	organizer_url: z.url({ message: 'URL är obligatoriskt' }).optional(),
	start: z.iso.date(),
	end: z.iso.date(),
	amount: z.coerce.number().positive(),
	price: z.coerce.number().positive(),
	language: z.string().optional(),
	slug: slugSchema,
});

export const courseCreateSchema = courseSchema.omit({
	id: true,
	slug: true,
});

export const courseUpdateSchema = courseCreateSchema;

export const signUpToCourseSchema = z.object({
	first_name: z.string().min(2, { message: 'Förnamn är obligatoriskt' }),
	last_name: z.string().min(2, { message: 'Efternamn är obligatoriskt' }),
	email: emailSchema,
	phone: z.string().min(8, { message: 'Telefonnummer är obligatoriskt' }),
	address: z.string(),
	postal_code: z.string(),
	city: z.string(),
	member: z.boolean(),
	course_id: uuidSchema,
});
