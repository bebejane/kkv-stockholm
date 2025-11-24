'use server';

import { getMemberSession } from '@/auth/utils';

export default async function test() {
	const session = await getMemberSession();
	return session;
}
