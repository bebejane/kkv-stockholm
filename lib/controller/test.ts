import { client, ApiError } from '@/lib/client';
import { Item } from '@/lib/client';
import { Member } from '@/types/datocms';
import { findById, getItemTypeIds } from './utils';
import {
	sendCreateAccountEmail,
	sendMemberAcceptedEmail,
	sendMemberCreatedEmail,
	sendMemberDeclinedEmail,
} from '@/lib/emails';
import { ZodError, z } from 'zod/v4';
import { memberStatusSchema, memberSignUpSchema, memberUpdateSchema } from '@/lib/schemas';

export type MemberType = Item<Member>;
export type MemberStatus = z.infer<typeof memberStatusSchema>;
export const MEMBER_STATUSES: MemberStatus[] = ['PENDING', 'ACCEPTED', 'DECLINED', 'PAID', 'INACTIVE', 'ACTIVE'];

export async function create(data: Partial<MemberType>): Promise<MemberType> {
	if (!data) throw new Error('Member data is required');
	try {
		const newMemberData = memberSignUpSchema.parse(data);
		const email = newMemberData.email as string;
		const { member: memberTypeId } = await getItemTypeIds(['member']);
		const member = await client.items.create<Member>({
			item_type: {
				id: memberTypeId as Member['itemTypeId'],
				type: 'item_type',
			},
			...newMemberData,
			member_status: 'PENDING',
			//verification_token: await generateVerificationToken(email as string),
		});
		await sendMemberCreatedEmail({ name: member.first_name as string, email: member.email as string });
		return member;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		throw e;
	}
}

export async function update(id: string, data: Partial<MemberType>): Promise<MemberType> {
	if (!id) throw new Error('Member Id is required');
	if (!data) throw new Error('Member data is required');
	try {
		const updatedMemberData = memberUpdateSchema.parse(data);
		const member = await client.items.update<Member>(id, updatedMemberData);
		return member;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		throw e;
	}
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new Error('Member Id is required');
	try {
		await client.items.destroy(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export async function find(id: string): Promise<MemberType | null> {
	if (!id) throw new Error('Member Id is required');
	const member = findById<MemberType>(id, 'member');
	return member ?? null;
}

export async function findByEmail(email: string): Promise<MemberType | null> {
	if (!email) return null;
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
export async function findByToken(token: string): Promise<MemberType | null> {
	if (!token) return null;
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
