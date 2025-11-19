import { z } from 'zod/v4';

export const schema = z.object({
	email: z.email({ message: 'Ogiltig e-postadress' }),
	password: z.string().min(1, { message: 'Lösenord är obligatoriskt' }),
});
