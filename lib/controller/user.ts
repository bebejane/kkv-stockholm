import { client, ApiError } from '@/lib/client';
import { getMember, getMemberByToken, updateMember } from '@/lib/controller/member';
import { AuthAccount, AuthSession, AuthUser } from '@/types/schema';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { z } from 'zod/v4';
import { auth } from '@/auth/auth';
import { sendBannedUserEmail } from '@/lib/postmark';
import { ca } from 'date-fns/locale';

export const schema = z.object({
	password: z.string().min(6, { message: 'Lösenord är obligatoriskt' }),
	password_confirmation: z.string().min(6, { message: 'Lösenord är obligatoriskt' }),
	token: z.string().min(10, { message: 'Token är obligatoriskt' }),
});

export async function createUser(data: Partial<Item<AuthUser>>, token: string): Promise<Item<AuthUser>> {
	try {
		const member = await getMemberByToken(token);
		if (!member) throw new Error('Invalid registration token');

		const { password, password_confirmation } = schema.parse(data);
		const itemTypes = await client.itemTypes.list();
		const authUserType = itemTypes.find((item) => item.api_key === 'auth_user');

		if (!authUserType) throw new Error('"auth_user" item type not found');

		const email = member.email as string;
		const { user } = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: `${member.first_name as string} ${member.last_name as string}`,
			},
		});

		await updateMember(member.id, { user: user.id, member_status: 'ACTIVE' });
		const authUser = await getUser(user.id);
		if (!authUser) throw new Error('User not found');
		return authUser;
	} catch (e) {
		if (e instanceof z.ZodError) throw new Error(JSON.stringify(e.issues));

		throw e;
	}
}

export async function removeUser(id: string): Promise<void> {
	const user = await getUser(id);
	if (!user) throw new Error('User not found');

	const member = await getMember(user.email as string);
	if (!member) throw new Error('Member not found');

	console.log('removeUser', user.id);

	const accountIds = (
		await client.items.list<AuthAccount>({
			filter: {
				type: 'auth_account',
				fields: {
					user_id: { eq: user.id },
				},
			},
		})
	).map(({ id }) => id);

	const sessionIds = (
		await client.items.list<AuthSession>({
			filter: {
				type: 'auth_session',
				fields: {
					user_id: { eq: user.id },
				},
			},
		})
	).map(({ id }) => id);

	const itemIdsToRemove = [...accountIds, ...sessionIds].filter(Boolean).reverse();
	//console.log('removeUser', 'itemIdsToRemove', itemIdsToRemove);
	for (id of itemIdsToRemove) await client.items.destroy(id);
	await updateMember(member.id, { user: null });
	await client.items.destroy(user.id);

	console.log('removeUser', 'done', id);
}

export async function banUser(id: string): Promise<void> {
	const user = await getUser(id);
	if (!user) throw new Error('User not found');

	console.log('banUser', user.id);
	console.log(process.env.BETTER_AUTH_DEFAULT_ADMIN_EMAIL, process.env.BETTER_AUTH_DEFAULT_ADMIN_PASSWORD);

	const { headers } = await auth.api.signInEmail({
		returnHeaders: true,
		body: {
			email: process.env.BETTER_AUTH_DEFAULT_ADMIN_EMAIL as string,
			password: process.env.BETTER_AUTH_DEFAULT_ADMIN_PASSWORD as string,
		},
	});

	console.log(JSON.stringify(headers, null, 2));

	try {
		await auth.api.banUser({
			headers,
			body: {
				userId: user.id,
				banReason: 'Inaktiverad',
			},
		});
		await sendBannedUserEmail({ to: user.email as string, name: user.name as string });
	} catch (e) {
		console.log('Error: banUser', user.id);
		console.log(e);

		throw e;
	}
}

export async function getUser(id: string): Promise<Item<AuthUser> | null> {
	if (!id) return null;
	const user = await client.items.find<AuthUser>(id);
	return user ?? null;
}

export async function getUserByEmail(email: string): Promise<Item<AuthUser> | null> {
	if (!email) null;
	const user = (
		await client.items.list<AuthUser>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'auth_user',
				fields: {
					email: { eq: email },
				},
			},
		})
	)?.[0];
	return user ?? null;
}
