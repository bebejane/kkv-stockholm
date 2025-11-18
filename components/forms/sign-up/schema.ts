import { nullable, z } from 'zod/v4';

export const schema = z.object({
	first_name: z.string().min(2, { message: 'Förnamn är obligatoriskt' }),
	last_name: z.string().min(2, { message: 'Efternamn är obligatoriskt' }),
	email: z.email({ message: 'Ogiltig e-postadress' }),
	phone: z.string().min(8, { message: 'Telefonnummer är obligatoriskt' }),
	phone_home: z.string(),
	sex: z.string().min(1, { message: 'Kön är obligatoriskt' }),
	address: z.string(),
	postal_code: z.string(),
	city: z.string(),
	ssa: z.string(),
	card: z.string(),
	compartment: z.string(),
	notes: z.string(),
	departments: z.string(),
	user: z.string(),
});
