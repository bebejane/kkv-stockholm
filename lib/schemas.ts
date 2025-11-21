import { z } from 'zod/v4';

export const uuidSchema = z
	.base64url()
	.refine((val) => /^[A-Za-z0-9_-]{22}$/.test(val), { message: 'Invalid base64url-encoded UUID format' });
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
	compartment: z.string(),
	card_number: z.string().min(1, { message: 'Kortnummer är obligatoriskt' }),
	workshops: z.array(z.string()),
	user: uuidSchema,
	verification_token: tokenSchema,
});

export const memberSignUpSchema = memberSchema.omit({
	id: true,
	workshops: true,
	user: true,
	member_status: true,
	verification_token: true,
});

export const memberUpdateSchema = memberSchema.omit({
	id: true,
	user: true,
	member_status: true,
	verification_token: true,
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

export const reportHoursSchema = z.coerce.number().positive().max(5);
export const reportDaysSchema = z.coerce.number().positive().max(365);
export const reportSchema = z.object({
	id: uuidSchema.optional(),
	member: uuidSchema.optional(),
	workshop: uuidSchema,
	hours: reportHoursSchema,
	days: reportDaysSchema,
	extra_cost: z.coerce.number().optional(),
	date: z.iso.date(),
	assistants: z
		.array(
			z.object({
				id: uuidSchema.optional(),
				hours: reportHoursSchema,
				days: reportDaysSchema,
			})
		)
		.optional(),
});

export const reportFormCreateSchema = reportSchema.omit({
	id: true,
	member: true,
});

export const reportCreateSchema = reportSchema.omit({
	id: true,
});

export const reportUpdateSchema = reportSchema.omit({
	id: true,
});

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
