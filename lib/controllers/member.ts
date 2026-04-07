import { client, ApiError } from '@/lib/client';
import { Item } from '@/lib/client';
import { Member } from '@/types/datocms';
import {
	findById,
	generateVerificationToken,
	getItemTypeIds,
	verifyVerificationToken,
} from './utils';
import {
	user as userTable,
	session as sessionTable,
	account as accountTable,
} from '@/db/auth-schema';
import { z } from 'zod/v4';
import { memberStatus, memberSignUpSchema, memberUpdateSchema } from '@/lib/schemas/member';
import { userCreateSchema } from '@/lib/schemas/user';
import { auth } from '@/auth/auth';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import * as emailController from '@/lib/controllers/email';
import { AllMembersDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import xlsx from 'node-xlsx';
import { authClient } from '@/auth/auth-client';
import { UserWithRole } from 'better-auth/plugins/admin';
import { Auth } from 'better-auth/types';
import {
	ValidationError,
	NotFoundError,
	AuthorizationError,
	ConflictError,
	BadRequestError,
} from '@/lib/errors';
import { ErrorMessages } from '@/lib/error-messages';

export type UserType = typeof userTable.$inferSelect;
export type MemberType = Item<Member>;
export type MemberStatus = z.infer<typeof memberStatus>;

export const MEMBER_STATUSES: MemberStatus[] = [
	'PENDING',
	'ACCEPTED',
	'DECLINED',
	'PAID',
	'INACTIVE',
	'ACTIVE',
];

export async function create(data: Partial<MemberType>): Promise<MemberType> {
	if (!data) throw new BadRequestError(ErrorMessages.MEMBER_DATA_REQUIRED);
	try {
		const newMemberData = memberSignUpSchema.parse(data);
		const email = newMemberData.email as string;

		if ((await findUserByEmail(email)) || (await findByEmail(email)))
			throw new ConflictError(ErrorMessages.EMAIL_ALREADY_REGISTERED);

		const { member: memberTypeId } = await getItemTypeIds(['member']);
		let member = await client.items.create<Member>({
			item_type: {
				id: memberTypeId as Member['itemTypeId'],
				type: 'item_type',
			},
			...newMemberData,
			member_status: 'PENDING',
			verification_token: await generateVerificationToken(email as string),
		});

		await emailController.sendMemberCreatedEmail({
			name: member.first_name as string,
			email: member.email as string,
		});

		await emailController.sendMemberCreatedNotificartionEmail({
			url: `${process.env.NEXT_PUBLIC_DATOCMS_BASE_EDITING_URL}/editor/item_types/${memberTypeId}/items/${member.id}`,
		});

		return member;
	} catch (e) {
		if (e instanceof z.ZodError) throw new ValidationError(ErrorMessages.VALIDATION_FAILED, e.issues);

		throw e;
	}
}

export async function update(id: string, data: Partial<MemberType>): Promise<MemberType> {
	if (!id) throw new BadRequestError(ErrorMessages.MEMBER_ID_REQUIRED);
	if (!data) throw new BadRequestError(ErrorMessages.MEMBER_DATA_REQUIRED);
	try {
		const updatedMemberData = memberUpdateSchema.parse(data);
		const member = await client.items.update<Member>(id, updatedMemberData);
		return member;
	} catch (e) {
		if (e instanceof z.ZodError) throw new ValidationError(ErrorMessages.VALIDATION_FAILED, e.issues);
		throw e;
	}
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new BadRequestError(ErrorMessages.MEMBER_ID_REQUIRED);
	await client.items.destroy(id);
}

export async function find(id: string): Promise<MemberType | null> {
	if (!id) throw new BadRequestError(ErrorMessages.MEMBER_ID_REQUIRED);
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

export async function createUser(data: Partial<UserType>, token: string): Promise<UserType> {
	try {
		const member = await findByToken(token);
		if (!member) throw new AuthorizationError(ErrorMessages.INVALID_REGISTRATION_TOKEN);
		const { email } = await verifyVerificationToken(member.verification_token as string);
		if (!email || member.email !== email) throw new AuthorizationError(ErrorMessages.INVALID_VERIFICATION_TOKEN);

		const { password } = userCreateSchema.parse(data);
		const { user } = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: `${member.first_name as string} ${member.last_name as string}`,
				callbackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/medlem`,
			},
		});
		await update(member.id, {
			...member,
			user: user.id,
			member_status: 'ACTIVE',
		});
		const authUser = await findUser(user.id);
		if (!authUser) throw new NotFoundError('User');
		return authUser;
	} catch (e) {
		if (e instanceof z.ZodError) throw new ValidationError(ErrorMessages.VALIDATION_FAILED, e.issues);
		throw e;
	}
}

export async function findUser(id: string): Promise<UserType | null> {
	if (!id) return null;
	const user = (await db.select().from(userTable).where(eq(userTable.id, id)))[0];
	return user ?? null;
}

export async function findUserByEmail(email: string): Promise<UserType | null> {
	if (!email) null;
	const user = (await db.select().from(userTable).where(eq(userTable.email, email)))?.[0];
	return user ?? null;
}

export async function removeMember(id: string): Promise<void> {
	const user = await findUser(id);
	if (!user) throw new NotFoundError('User');

	const member = await findByEmail(user.email as string);
	if (!member) throw new NotFoundError('Member');
	await banUser(user.id, true);
	await removeUser(user.id);
	await update(member.id, { ...member, user: '' });
}

export async function removeUser(id: string): Promise<void> {
	await banUser(id, true);
	await db.delete(accountTable).where(eq(accountTable.userId, id));
	await db.delete(sessionTable).where(eq(sessionTable.userId, id));
	await db.delete(userTable).where(eq(userTable.id, id));
}

export async function unbanUser(id: string): Promise<void> {
	const user = await findUser(id);
	if (!user) throw new NotFoundError('User');

	await db.update(userTable).set({ banned: false, banReason: null }).where(eq(userTable.id, id));
	await emailController.sendUnBannedUserEmail({
		to: user.email as string,
		name: user.name as string,
	});
}

export async function banUser(id: string, silent?: boolean): Promise<void> {
	const user = await findUser(id);
	if (!user) throw new NotFoundError('User');

	await db.update(userTable).set({ banned: false, banReason: null }).where(eq(userTable.id, id));
	await db.delete(sessionTable).where(eq(sessionTable.userId, id));
	await db
		.update(userTable)
		.set({ banned: true, banReason: 'Inaktiverad' })
		.where(eq(userTable.id, id));

	if (!silent)
		await emailController.sendBannedUserEmail({
			to: user.email as string,
			name: user.name as string,
		});
}

export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<void> {
	if (!userId) throw new BadRequestError(ErrorMessages.USER_ID_REQUIRED);
	if (!role) throw new BadRequestError(ErrorMessages.ROLE_REQUIRED);
	if (role !== 'admin' && role !== 'user') throw new BadRequestError(ErrorMessages.INVALID_ROLE);
	await db.update(userTable).set({ role }).where(eq(userTable.id, userId));
}

export async function handleMemberChange(email: string): Promise<MemberStatus> {
	if (!email) throw new BadRequestError(ErrorMessages.EMAIL_REQUIRED);
	const member = await findByEmail(email);

	if (!member) throw new NotFoundError('Member', email);

	const status = member.member_status as MemberStatus;
	const user = await findUser(member.user as string);

	if (!status) throw new BadRequestError(ErrorMessages.STATUS_REQUIRED);
	if (!MEMBER_STATUSES.includes(status)) throw new BadRequestError(ErrorMessages.INVALID_STATUS(status));

	switch (status) {
		case 'PENDING':
			break;
		case 'PAID':
			if (!user) {
				await emailController.sendCreateYourAccountEmail({
					name: member.first_name as string,
					email: member.email as string,
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/skapa-konto?token=${member.verification_token as string}`,
				});
			}
			break;
		case 'ACCEPTED':
			await emailController.sendMemberAcceptedEmail({
				name: member.first_name as string,
				email: member.email as string,
			});
			break;
		case 'DECLINED':
			user && (await banUser(user.id));
			await emailController.sendMemberDeclinedEmail({
				name: member.first_name as string,
				email: member.email as string,
			});
			break;
		case 'INACTIVE':
			user && (await banUser(user.id));
			break;
		case 'ACTIVE':
			if (!user)
				await emailController.sendCreateYourAccountEmail({
					name: member.first_name as string,
					email: member.email as string,
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/skapa-konto?token=${member.verification_token as string}`,
				});
			break;
	}

	if (user && status !== 'INACTIVE' && user.banned) await unbanUser(user.id);

	return status;
}

export async function generateMembersList(): Promise<Buffer> {
	const { allMembers } = await apiQuery(AllMembersDocument, { all: true });
	const rows = [];
	const header = [
		'Förnamn',
		'Efternamn',
		'E-post',
		'Address',
		'Stad',
		'Postnummer',
		'Telefon',
		'Personnummer',
		'Status',
	];

	for (const member of allMembers) {
		rows.push([
			member.firstName,
			member.lastName,
			member.email,
			member.address,
			member.city,
			member.postalCode,
			member.phone,
			member.ssa,
			member.memberStatus,
		]);
	}

	const data = [header, ...rows];
	const buffer = xlsx.build([{ name: 'Medlemmar', data, options: {} }]);
	return buffer;
}
