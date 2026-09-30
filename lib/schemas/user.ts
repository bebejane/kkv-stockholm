import { z, email, password, passwordCreate } from './base';

export const userSignInSchema = z.object({
	email: email,
	password: password,
});

export const adminSignInSchema = z.object({
	admin_email: email,
	admin_password: password,
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
