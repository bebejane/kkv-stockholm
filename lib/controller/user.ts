import * as memberController from '@/lib/controller/member';
import { Item } from '@/lib/client';
import { z } from 'zod/v4';
import { auth } from '@/auth/auth';
import { sendBannedUserEmail, sendUnBannedUserEmail } from '@/lib/emails';
import { userCreateSchema } from '@/lib/schemas';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { user as userTable, session as sessionTable, account as accountTable } from '@/db/auth-schema';

export type User = typeof userTable.$inferSelect;

export async function create(data: Partial<User>, token: string): Promise<User> {
	try {
		const member = await memberController.findByToken(token);
		if (!member) throw new Error('Invalid registration token');

		const { password } = userCreateSchema.parse(data);
		const email = member.email as string;
		const { user } = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: `${member.first_name as string} ${member.last_name as string}`,
				callbackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/medlem`,
			},
		});
		console.log('create user', user, member);
		await memberController.update(member.id, {
			...member,
			user: user.id,
			member_status: 'ACTIVE',
		});
		const authUser = await find(user.id);
		if (!authUser) throw new Error('User not found');
		return authUser;
	} catch (e) {
		console.log(e);
		if (e instanceof z.ZodError) throw new Error(JSON.stringify(e.issues));

		throw e;
	}
}

export async function remove(id: string): Promise<void> {
	const user = await find(id);
	if (!user) throw new Error('User not found');

	const member = await memberController.findByEmail(user.email as string);
	if (!member) throw new Error('Member not found');

	console.log('removeUser', user.id);

	await db.delete(accountTable).where(eq(accountTable.userId, user.id));
	await db.delete(sessionTable).where(eq(sessionTable.userId, user.id));
	await db.delete(userTable).where(eq(userTable.id, user.id));
	await memberController.update(member.id, { ...member, user: null });
	console.log('removeUser', 'done', id);
}

export async function find(id: string): Promise<User | null> {
	if (!id) return null;
	const user = (await db.select().from(userTable).where(eq(userTable.id, id)))[0];
	console.log('find', user);
	return user ?? null;
}

export async function findByEmail(email: string): Promise<User | null> {
	if (!email) null;
	const user = (await db.select().from(userTable).where(eq(userTable.email, email)))?.[0];
	return user ?? null;
}

export async function unban(id: string): Promise<void> {
	const user = await find(id);
	if (!user) throw new Error('User not found');
	console.log('unban', user.id);
	await db.update(userTable).set({ banned: false, banReason: null }).where(eq(userTable.id, id));
	await sendUnBannedUserEmail({ to: user.email as string, name: user.name as string });
}

export async function ban(id: string): Promise<void> {
	const user = await find(id);
	if (!user) throw new Error('User not found');

	await db.update(userTable).set({ banned: false, banReason: null }).where(eq(userTable.id, id));
	await db.delete(sessionTable).where(eq(sessionTable.userId, id));
	await db.update(userTable).set({ banned: true, banReason: 'Inaktiverad' }).where(eq(userTable.id, id));
	await sendBannedUserEmail({ to: user.email as string, name: user.name as string });

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
