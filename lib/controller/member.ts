import { client, ApiError } from '@/lib/client';
import { Member } from '@/types/datocms';
import { getItemTypeIds } from './utils';
import {
	sendCreateAccountEmail,
	sendMemberAcceptedEmail,
	sendMemberCreatedEmail,
	sendMemberDeclinedEmail,
} from '@/lib/emails';
import { ZodError, z } from 'zod/v4';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import crypto from 'crypto';
import { banUser, getUser, removeUser, unbanUser } from '@/lib/controller/user';
import { memberStatusSchema, memberSignUpSchema, memberUpdateSchema } from '@/lib/schemas';

export type MemberStatus = z.infer<typeof memberStatusSchema>;
export const MEMBER_STATUSES: MemberStatus[] = ['PENDING', 'ACCEPTED', 'DECLINED', 'PAID', 'INACTIVE', 'ACTIVE'];

export async function createMember(data: Partial<Item<Member>>): Promise<Item<Member>> {
	try {
		const newMemberData = memberSignUpSchema.parse(data);
		const { member: memberTypeId } = await getItemTypeIds(['member']);
		const member = await client.items.create<Member>({
			item_type: {
				id: memberTypeId as Member['itemTypeId'],
				type: 'item_type',
			},
			...newMemberData,
			verification_token: crypto.randomBytes(64).toString('hex'),
		});
		await sendMemberCreatedEmail({ name: member.first_name as string, email: member.email as string });
		return member;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		throw e;
	}
}

export async function updateMember(id: string, data: Partial<Item<Member>>): Promise<Item<Member>> {
	try {
		const updatedMemberData = memberUpdateSchema.parse(data);
		const member = await client.items.update<Member>(id, updatedMemberData);
		return member;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
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

export async function getMemberByEmail(email: string): Promise<Item<Member> | null> {
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
export async function getMemberByToken(token: string): Promise<Item<Member> | null> {
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

export async function getMember(email: string): Promise<Item<Member> | null> {
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
export async function getMemberById(id: string): Promise<Item<Member> | null> {
	if (!id) return null;
	const member = (
		await client.items.list<Member>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'member',
				fields: {
					id: { eq: id },
				},
			},
		})
	)?.[0];

	return member ?? null;
}

export async function handleMemberChange(email: string) {
	if (!email) throw new Error('Email is required');
	const member = await getMember(email);

	if (!member) throw new Error('Member not found');

	const status = member.member_status as MemberStatus;
	const user = await getUser(member.user as string);

	if (!status) throw new Error('Status is required');
	if (!MEMBER_STATUSES.includes(status)) throw new Error(`Invalid status: ${status}`);

	switch (status) {
		case 'PENDING':
			if (user) await removeUser(user.id);
			else console.warn(`Member ${member.email} is not signed up`, status);
			break;
		case 'PAID':
			if (!user)
				await sendCreateAccountEmail({
					name: member.first_name as string,
					email: member.email as string,
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/skapa-konto?token=${member.verification_token as string}`,
				});
			else console.warn(`Member ${member.email} is not signed up`, status);
			break;
		case 'ACCEPTED':
			await sendMemberAcceptedEmail({ name: member.first_name as string, email: member.email as string });
			break;
		case 'DECLINED':
			await sendMemberDeclinedEmail({ name: member.first_name as string, email: member.email as string });
			break;
		case 'INACTIVE':
			user && (await banUser(user.id));
			break;
		case 'ACTIVE':
			if (!user)
				await sendCreateAccountEmail({
					name: member.first_name as string,
					email: member.email as string,
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/skapa-konto?token=${member.verification_token as string}`,
				});
			else console.warn(`Member ${member.email} is already signed up`, status);
			break;
	}

	if (user && status !== 'INACTIVE' && user.banned) await unbanUser(user.id);
}
