import { client, ApiError } from '@/lib/client';
import { Member } from '@/types/schema';
import { sendSignUpEmail } from '@/lib/postmark';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { z } from 'zod/v4';
import crypto from 'crypto';

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
});

export async function createMember(data: Partial<Item<Member>>): Promise<Item<Member>> {
	try {
		schema.parse(data);

		const itemTypes = await client.itemTypes.list();
		const memberType = itemTypes.find((item) => item.api_key === 'member');
		if (!memberType) throw new Error('"member" item type not found');

		const invalidKeys = [undefined, null, ''];

		Object.keys(data).forEach((key) => {
			const k = key as keyof typeof data;
			if (data[k] === undefined || data[k] === '' || invalidKeys.includes(k)) delete data[k];
		});

		const member = await client.items.create<Member>({
			item_type: {
				id: memberType.id as Member['itemTypeId'],
				type: 'item_type',
			},
			...data,
			verification_token: crypto.randomBytes(64).toString('hex'),
		});
		await sendSignUpEmail({ name: member.first_name as string, email: member.email as string });
		return member;
	} catch (e) {
		if (e instanceof z.ZodError) throw new Error(JSON.stringify(e.issues));

		throw e;
	}
}

export async function updateMember(id: string, data: Partial<Item<Member>>): Promise<Item<Member>> {
	try {
		const member = await client.items.update<Member>(id, data);
		return member;
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export async function removeMember(id: string): Promise<void> {
	try {
		await client.items.destroy(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export async function getMemberByToken(token: string): Promise<Item<Member> | null> {
	const member = (
		await client.items.list<Member>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'member',
				fields: {
					verification_token: { eq: token },
				},
			},
		})
	)?.[0];

	return member ?? null;
}

export async function getMember(email: string): Promise<Item<Member> | null> {
	const member = (
		await client.items.list<Member>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'member',
				fields: {
					email: { eq: email },
				},
			},
		})
	)?.[0];

	return member ?? null;
}
