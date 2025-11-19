import { z } from 'zod/v4';

export const schema = z
	.object({
		password: z.string().min(6, { message: 'Lösenord är obligatoriskt' }),
		password_confirmation: z.string().min(6, { message: 'Lösenord är obligatoriskt' }),
		token: z.string().min(10, { message: 'Token är obligatoriskt' }),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: 'Lösenorden matchar inte',
		path: ['password', 'password_confirmation'],
	});
