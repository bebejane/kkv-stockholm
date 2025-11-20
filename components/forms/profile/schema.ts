import { z } from 'zod/v4';

export const schema = z.object({
	first_name: z.string().min(2, { message: 'Förnamn är obligatoriskt' }),
	last_name: z.string().min(2, { message: 'Efternamn är obligatoriskt' }),
	phone: z.string().min(8, { message: 'Telefonnummer är obligatoriskt' }),
	phone_home: z.string(),
	sex: z.string().min(1, { message: 'Kön är obligatoriskt' }),
	address: z.string(),
	postal_code: z.string(),
	city: z.string(),
	ssa: z.string(),
	card_number: z.string(),
	compartment: z.string(),
});
