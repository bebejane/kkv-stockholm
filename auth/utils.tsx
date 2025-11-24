import { auth } from '@/auth/auth';
import { findByEmail, MemberType } from '@/lib/controller/member';
import { Session, User } from 'better-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export type UserSession = {
	user: User;
	session: Session;
	headers: Headers;
};

export type MemberUserSession = {
	user: User;
	session: Session;
	headers: Headers;
	member: MemberType;
};

export async function withUserAuth(
	req: NextRequest,
	callback: (req: NextRequest, session: UserSession) => Promise<NextResponse>
): Promise<Response> {
	try {
		const session = await getUserSession();
		return await callback(req, session);
	} catch (e) {
		return new NextResponse('unauthorized', { status: 401 });
	}
}

export async function withMemberAuth(
	req: NextRequest,
	callback: (req: NextRequest, session: MemberUserSession) => Promise<NextResponse>
): Promise<Response> {
	try {
		//const headers = req.headers;
		const session = await getMemberSession();
		return await callback(req, session);
	} catch (e) {
		return new NextResponse('unauthorized', { status: 401 });
	}
}

export async function getUserSession(options?: { headers?: Headers; redirectTo?: string }): Promise<UserSession> {
	const res = await auth.api.getSession({ headers: await headers(), returnHeaders: true });
	const user = res.response?.user;
	const session = res.response?.session;
	const head = res.headers;

	if (!user || !session) return redirect(options?.redirectTo ?? '/logga-in');

	return {
		user,
		session,
		headers: head,
	} as UserSession;
}

export async function getMemberSession(options?: {
	headers?: Headers;
	redirectTo?: string;
}): Promise<MemberUserSession> {
	const session = await getUserSession(options);
	const member = await findByEmail(session.user.email);
	if (!member) throw new Error('Unauthorized');
	return { ...session, member } as MemberUserSession;
}
