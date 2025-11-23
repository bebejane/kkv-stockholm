import { client, ApiError } from '@/lib/client';
import { Item } from '@/lib/client';
import { Member } from '@/types/datocms';
import { findById, generateVerificationToken, getItemTypeIds, verifyVerificationToken } from './utils';
import { user as userTable, session as sessionTable, account as accountTable } from '@/db/auth-schema';
import { ZodError, z } from 'zod/v4';
import { memberStatusSchema, memberSignUpSchema, memberUpdateSchema, userCreateSchema } from '@/lib/schemas';
import { auth } from '@/auth/auth';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import * as emailController from '@/lib/controller/email';

export type UserType = typeof userTable.$inferSelect;
export type MemberType = Item<Member>;
export type MemberStatus = z.infer<typeof memberStatusSchema>;

export const MEMBER_STATUSES: MemberStatus[] = ['PENDING', 'ACCEPTED', 'DECLINED', 'PAID', 'INACTIVE', 'ACTIVE'];

export async function create(data: Partial<MemberType>): Promise<MemberType> {
	if (!data) throw new Error('Member data is required');
	try {
		const newMemberData = memberSignUpSchema.parse(data);
		const email = newMemberData.email as string;

		if ((await findUserByEmail(email)) || (await findByEmail(email)))
			throw new Error('E-postadressen är redan registrerad');

		const { member: memberTypeId } = await getItemTypeIds(['member']);
		const member = await client.items.create<Member>({
			item_type: {
				id: memberTypeId as Member['itemTypeId'],
				type: 'item_type',
			},
			...newMemberData,
			member_status: 'PENDING',
			verification_token: await generateVerificationToken(email as string),
		});
		await emailController.sendMemberCreatedEmail({ name: member.first_name as string, email: member.email as string });
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

export async function createUser(data: Partial<UserType>, token: string): Promise<UserType> {
	try {
		const member = await findByToken(token);
		if (!member) throw new Error('Invalid registration token');
		const { email } = await verifyVerificationToken(member.verification_token as string);
		if (!email || member.email !== email) throw new Error('Invalid verification token');

		const { password } = userCreateSchema.parse(data);
		const { user } = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: `${member.first_name as string} ${member.last_name as string}`,
				callbackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/medlem`,
			},
		});
		console.log('create user', user, member);
		await update(member.id, {
			...member,
			user: user.id,
			member_status: 'ACTIVE',
		});
		const authUser = await findUser(user.id);
		if (!authUser) throw new Error('User not found');
		return authUser;
	} catch (e) {
		console.log(e);
		if (e instanceof z.ZodError) throw new Error(JSON.stringify(e.issues));

		throw e;
	}
}

export async function removeUser(id: string): Promise<void> {
	const user = await find(id);
	if (!user) throw new Error('User not found');

	const member = await findByEmail(user.email as string);
	if (!member) throw new Error('Member not found');

	console.log('removeUser', user.id);

	await db.delete(accountTable).where(eq(accountTable.userId, user.id));
	await db.delete(sessionTable).where(eq(sessionTable.userId, user.id));
	await db.delete(userTable).where(eq(userTable.id, user.id));
	await update(member.id, { ...member, user: null });
	console.log('removeUser', 'done', id);
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

export async function unbanUser(id: string): Promise<void> {
	const user = await findUser(id);
	if (!user) throw new Error('User not found');
	console.log('unban', user.id);
	await db.update(userTable).set({ banned: false, banReason: null }).where(eq(userTable.id, id));
	await emailController.sendUnBannedUserEmail({ to: user.email as string, name: user.name as string });
}

export async function banUser(id: string): Promise<void> {
	const user = await findUser(id);
	if (!user) throw new Error('User not found');

	await db.update(userTable).set({ banned: false, banReason: null }).where(eq(userTable.id, id));
	await db.delete(sessionTable).where(eq(sessionTable.userId, id));
	await db.update(userTable).set({ banned: true, banReason: 'Inaktiverad' }).where(eq(userTable.id, id));
	await emailController.sendBannedUserEmail({ to: user.email as string, name: user.name as string });

	// const { headers, response } = await auth.api.signInEmail({
	// 	returnHeaders: true,
	// 	body: {
	// 		email: process.env.BETTER_AUTH_DEFAULT_ADMIN_EMAIL as string,
	// 		password: process.env.BETTER_AUTH_DEFAULT_ADMIN_PASSWORD as string,
	// 	},
	// });

	// console.log('response', user.id);

	// try {
	// 	await auth.api.banUser({
	// 		headers,
	// 		body: {
	// 			userId: user.id,
	// 			banReason: 'Inaktiverad',
	// 		},
	// 	});
	// 	await sendBannedUserEmail({ to: user.email as string, name: user.name as string });
	// } catch (e) {
	// 	console.log('Error: banUser', user.id);
	// 	console.log(e);

	// 	throw e;
	// }
}

export async function handleMemberChange(email: string) {
	if (!email) throw new Error('Email is required');
	const member = await findByEmail(email);

	if (!member) throw new Error('Member not found');

	const status = member.member_status as MemberStatus;
	const user = await findUser(member.user as string);

	if (!status) throw new Error('Status is required');
	if (!MEMBER_STATUSES.includes(status)) throw new Error(`Invalid status: ${status}`);

	switch (status) {
		case 'PENDING':
			if (user) await removeUser(user.id);
			else console.warn(`Member ${member.email} is not signed up`, status);
			break;
		case 'PAID':
			if (!user)
				await emailController.sendCreateYourAccountEmail({
					name: member.first_name as string,
					email: member.email as string,
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/skapa-konto?token=${member.verification_token as string}`,
				});
			else console.warn(`Member ${member.email} is not signed up`, status);
			break;
		case 'ACCEPTED':
			await emailController.sendMemberAcceptedEmail({
				name: member.first_name as string,
				email: member.email as string,
			});
			break;
		case 'DECLINED':
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
			else console.warn(`Member ${member.email} is already signed up`, status);
			break;
	}

	if (user && status !== 'INACTIVE' && user.banned) await unbanUser(user.id);
}
