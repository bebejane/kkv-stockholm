import { client, ApiError } from '@/lib/client';
import { getMember, getMemberByToken, updateMember } from '@/lib/controller/member';
import { AuthAccount, AuthSession, AuthUser } from '@/types/schema';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { z } from 'zod/v4';
import { auth } from '@/auth';

export const schema = z.object({
	email: z.email({ message: 'Ogiltig e-postadress' }),
	password: z.string().min(6, { message: 'Lösenord är obligatoriskt' }),
	password_confirmation: z.string().min(6, { message: 'Lösenord är obligatoriskt' }),
	token: z.string().min(10, { message: 'Token är obligatoriskt' }),
});

export async function createUser(data: Partial<Item<AuthUser>>, token: string): Promise<Item<AuthUser>> {
	try {
		const member = await getMemberByToken(token);
		if (!member) throw new Error('Invalid registration token');

		const { email, password } = schema.parse(data);
		const itemTypes = await client.itemTypes.list();
		const authUserType = itemTypes.find((item) => item.api_key === 'auth_user');

		if (!authUserType) throw new Error('"auth_user" item type not found');

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
				type: 'auth_account',
				fields: {
					user_id: { eq: user.id },
				},
			},
		})
	).map(({ id }) => id);

	const itemIdsToRemove = [user.id, ...accountIds, ...sessionIds].filter(Boolean);
	for (id of itemIdsToRemove) await client.items.destroy(id);
	await updateMember(member.id, { user: null });
}

export async function banUser(id: string): Promise<void> {
	const user = await getUser(id);
	if (!user) throw new Error('User not found');

	throw new Error('Not implemented');
	//@ts-ignore
	await auth.admin.banUser({ userId: user.id, reason: 'Banned by KKV system' });
}

export async function getUser(id: string): Promise<Item<AuthUser> | null> {
	const user = (
		await client.items.list<AuthUser>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'auth_user',
				fields: {
					id: { eq: id },
				},
			},
		})
	)?.[0];
	return user ?? null;
}

export async function getUserByEmail(email: string): Promise<Item<AuthUser> | null> {
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
