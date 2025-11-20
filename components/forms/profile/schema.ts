import { z } from 'zod/v4';

export const schema = z.object({
	first_name: z.string().min(2, { message: 'Förnamn är obligatoriskt' }),
	last_name: z.string().min(2, { message: 'Efternamn är obligatoriskt' }),
	email: z.email({ message: 'Ogiltig e-postadress' }),
	phone: z.string().min(8, { message: 'Telefonnummer är obligatoriskt' }),
	phone_home: z.string(),
	sex: z.string().min(1, { message: 'Kön är obligatoriskt' }),
	address: z.string().min(6, { message: 'Adress är obligatoriskt' }),
	postal_code: z.string().min(5, { message: 'Postnummer är obligatoriskt' }),
	city: z.string().min(2, { message: 'Stad är obligatoriskt' }),
	ssa: z.string().min(12, { message: 'Personnummer är obligatoriskt' }),
	card_number: z.string().min(6, { message: 'Kortnummer är obligatoriskt' }),
	workshops: z.array(z.string()),
});
