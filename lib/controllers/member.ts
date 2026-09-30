import { client, ApiError } from '@/lib/client';
import { Item } from '@/lib/client';
import { Member } from '@/types/datocms';
import { findById, getItemTypeIds } from './utils';
import { randomBytes } from 'node:crypto';
import { user as userTable } from '@/db/auth-schema';
import {
	banAuthUser,
	markAuthUserVerified,
	removeAuthUser,
	setAuthUserRole,
	unbanAuthUser,
} from '@/lib/auth-admin';
import { z } from 'zod/v4';
import {
	memberStatus,
	memberSignUpSchema,
	memberUpdateSchema,
	memberSelfUpdateSchema,
} from '@/lib/schemas/member';
import { auth } from '@/auth/auth';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import * as emailController from '@/lib/controllers/email';
import { findOrCreateCustomer } from '@/lib/controllers/spiris';
import { AllMembersDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import xlsx from 'node-xlsx';
import {
	ValidationError,
	NotFoundError,
	ConflictError,
	BadRequestError,
} from '@/lib/errors';
import { ErrorMessages } from '@/lib/error-messages';
import { authClient } from '@/auth/auth-client';

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
		});

		// The member is already created; a mail failure must not fail the sign-up.
		await emailController.safeSendEmail(() =>
			emailController.sendMemberCreatedEmail({
				name: member.first_name as string,
				email: member.email as string,
			}),
		);

		await emailController.safeSendEmail(() =>
			emailController.sendMemberCreatedNotificartionEmail({
				url: `${process.env.NEXT_PUBLIC_DATOCMS_BASE_EDITING_URL}/editor/item_types/${memberTypeId}/items/${member.id}`,
			}),
		);

		return member;
	} catch (e) {
		if (e instanceof z.ZodError)
			throw new ValidationError(ErrorMessages.VALIDATION_FAILED, e.issues);

		throw e;
	}
}

export async function update(
	id: string,
	data: Partial<MemberType>,
	schema: typeof memberUpdateSchema | typeof memberSelfUpdateSchema = memberUpdateSchema,
): Promise<MemberType> {
	if (!id) throw new BadRequestError(ErrorMessages.MEMBER_ID_REQUIRED);
	if (!data) throw new BadRequestError(ErrorMessages.MEMBER_DATA_REQUIRED);
	try {
		const updatedMemberData = schema.parse(data);
		const member = await client.items.update<Member>(id, updatedMemberData);
		return member;
	} catch (e) {
		if (e instanceof z.ZodError)
			throw new ValidationError(ErrorMessages.VALIDATION_FAILED, e.issues);
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
/**
 * Creates (or finds) the better-auth user for a member and links it, so the
 * member can be invited to set a password. Idempotent.
 */
async function ensureMemberUser(member: MemberType): Promise<UserType> {
	if (member.user) {
		const linked = await findUser(member.user as string);
		if (linked) return linked;
	}

	let user = await findUserByEmail(member.email as string);

	if (!user) {
		// A random password the member never sees; they set their own via the
		// emailed set-password link.
		const password = randomBytes(12).toString('base64url');
		try {
			const created = await auth.api.createUser({
				body: {
					email: member.email as string,
					password,
					name: `${member.first_name as string} ${member.last_name as string}`.trim(),
				},
			});
			user = await findUser(created.user.id);
		} catch (e) {
			// A concurrent run may have created the user first.
			user = await findUserByEmail(member.email as string);
			if (!user) throw e;
		}
	}

	if (!user) throw new NotFoundError('User');

	// Invited members prove email ownership via the set-password link, so mark
	// them verified (required to sign in) instead of sending a second email.
	await markAuthUserVerified(user.id);

	return user;
}

/**
 * Ensures the member has an auth user and emails them a link to set a password
 * (better-auth's password-reset flow — short-lived and single-use). The member
 * record is only linked once the invite has gone out, so a failed send leaves
 * it unlinked and a later run retries.
 */
async function inviteMember(member: MemberType): Promise<void> {
	const user = await ensureMemberUser(member);

	try {
		await auth.api.requestPasswordReset({
			body: {
				email: member.email as string,
				redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/skapa-konto`,
			},
		});
	} catch (e) {
		console.error('Failed to send account invite', member.email, e);
		return;
	}

	await client.items.update(member.id, { user: user.id, member_status: 'ACTIVE' });
}

export async function findUser(id: string): Promise<UserType | null> {
	if (!id) return null;
	const user = (await db.select().from(userTable).where(eq(userTable.id, id)))[0];
	return user ?? null;
}

export async function findUserByEmail(email: string): Promise<UserType | null> {
	if (!email) return null;
	const user = (await db.select().from(userTable).where(eq(userTable.email, email)))?.[0];
	return user ?? null;
}

export async function removeMember(id: string): Promise<void> {
	const user = await findUser(id);
	if (!user) throw new NotFoundError('User');

	const member = await findByEmail(user.email as string);
	if (!member) throw new NotFoundError('Member');
	await removeUser(user.id);
	await update(member.id, { ...member, user: '' });
}

export async function removeUser(id: string): Promise<void> {
	// `removeUser` deletes the user plus all their sessions and accounts.
	await removeAuthUser(id);
}

export async function unbanUser(id: string): Promise<void> {
	const user = await findUser(id);
	if (!user) throw new NotFoundError('User');

	await unbanAuthUser(id);
	await emailController.safeSendEmail(() =>
		emailController.sendUnBannedUserEmail({
			to: user.email as string,
			name: user.name as string,
		}),
	);
}

export async function banUser(id: string, silent?: boolean): Promise<void> {
	const user = await findUser(id);
	if (!user) throw new NotFoundError('User');

	await banAuthUser(id, 'Inaktiverad');

	if (!silent)
		await emailController.safeSendEmail(() =>
			emailController.sendBannedUserEmail({
				to: user.email as string,
				name: user.name as string,
			}),
		);
}

export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<void> {
	if (!userId) throw new BadRequestError(ErrorMessages.USER_ID_REQUIRED);
	if (!role) throw new BadRequestError(ErrorMessages.ROLE_REQUIRED);
	if (role !== 'admin' && role !== 'user') throw new BadRequestError(ErrorMessages.INVALID_ROLE);
	await setAuthUserRole(userId, role);
}

export async function handleMemberChange(email: string): Promise<MemberStatus> {
	if (!email) throw new BadRequestError(ErrorMessages.EMAIL_REQUIRED);
	const member = await findByEmail(email);

	if (!member) throw new NotFoundError('Member', email);

	const status = member.member_status as MemberStatus;
	const user = await findUser(member.user as string);

	if (!status) throw new BadRequestError(ErrorMessages.STATUS_REQUIRED);
	if (!MEMBER_STATUSES.includes(status))
		throw new BadRequestError(ErrorMessages.INVALID_STATUS(status));

	switch (status) {
		case 'PENDING':
			break;
		case 'PAID':
			if (!user) await inviteMember(member);
			try {
				await findOrCreateCustomer(member.id, member.email as string, member);
			} catch (e) {
				console.error('Failed to create Spiris customer for member', member.email, e);
			}
			break;
		case 'ACCEPTED':
			await emailController.safeSendEmail(() =>
				emailController.sendMemberAcceptedEmail({
					name: member.first_name as string,
					email: member.email as string,
				}),
			);
			break;
		case 'DECLINED':
			user && (await banUser(user.id));
			await emailController.safeSendEmail(() =>
				emailController.sendMemberDeclinedEmail({
					name: member.first_name as string,
					email: member.email as string,
				}),
			);
			break;
		case 'INACTIVE':
			user && (await banUser(user.id));
			break;
		case 'ACTIVE':
			if (!user) await inviteMember(member);
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
