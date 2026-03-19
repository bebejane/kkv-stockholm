import { z, uuid, email, password, token, passwordCreate } from './base';

export const userSchema = z.object({
	id: uuid,
	name: z.string(),
	email: email,
	email_verified_at: z.boolean(),
	image: z.object({
		url: z.string(),
	}),
	accounts: z.array(uuid),
	sessions: z.array(uuid),
	verfication_tokens: z.array(uuid),
	role: z.literal(['user', 'admin']),
	banned: z.boolean(),
	ban_reason: z.string(),
	ban_expires: z.date(),
});

export const userCreateSchema = z
	.object({
		password: passwordCreate,
		password_confirmation: passwordCreate,
		token: token,
	})
	.refine((data) => data.password === data.password_confirmation, {
		error: 'Lösenorden matchar inte',
		path: ['password_confirmation'],
	});

export const userSignInSchema = z.object({
	email: email,
	password: password,
});

export const userRequestResetPasswordSchema = z.object({
	email: email,
});

export const userResetPasswordSchema = z
	.object({
		password: passwordCreate,
		password_confirmation: passwordCreate,
	})
	.refine((data) => data.password === data.password_confirmation, {
		error: 'Lösenorden matchar inte',
		path: ['password_confirmation'],
	});
