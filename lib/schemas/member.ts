import { z, uuid, token } from './base';

export const memberSex = z.literal(['man', 'woman', 'other'], { error: 'Kön är obligatoriskt' });
export const memberStatus = z.literal(
	['PENDING', 'ACCEPTED', 'DECLINED', 'PAID', 'INACTIVE', 'ACTIVE'],
	{
		error: 'Status är obligatoriskt',
	},
);

export const memberSchema = z.object({
	id: uuid,
	first_name: z.string().min(2, { error: 'Förnamn är obligatoriskt' }),
	last_name: z.string().min(2, { error: 'Efternamn är obligatoriskt' }),
	references: z.preprocess((v) => (v === null || typeof v === 'undefined' ? '' : v), z.string()),
	email: z.email({ error: 'Ogiltig e-postadress' }),
	member_status: memberStatus,
	phone: z.string().min(8, { error: 'Telefonnummer är obligatoriskt' }),
	sex: memberSex,
	address: z.string().min(6, { error: 'Adress är obligatoriskt' }),
	postal_code: z.string().min(5, { error: 'Postnummer är obligatoriskt' }),
	city: z.string().min(2, { error: 'Stad är obligatoriskt' }),
	ssa: z.string().min(10, { error: 'Personnummer är obligatoriskt' }),
	portfolio: z
		.url({ error: 'Url är ogiltig' })
		.or(z.literal(''))
		.transform((url) => url || undefined),
	education: z.preprocess(
		(v) => (v === null || typeof v === 'undefined' ? '' : v),
		z.string().transform((val) => (val && val.trim() ? val : null)),
	),
	artistic_practice: z.preprocess(
		(v) => (v === null || typeof v === 'undefined' ? '' : v),
		z.string().transform((val) => (val && val.trim() ? val : null)),
	),
	compartment: z.string().optional(),
	card_number: z.string().optional(),
	workshops: z.array(z.string()),
	user: z.string().optional(),
	verification_token: token,
});

export const memberSignUpSchema = memberSchema
	.omit({
		id: true,
		user: true,
		member_status: true,
		verification_token: true,
		sex: true,
		references: true,
	})
	.extend({
		rules_accepted: z.literal(true, {
			error: 'Du måste godkänna medlems reglerna för att registrera dig',
		}),
	});

export const memberUpdateSchema = memberSchema.omit({
	id: true,
});
