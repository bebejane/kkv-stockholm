import { auth } from '@/auth/auth';
import { findByEmail, MemberType } from '@/lib/controller/member';
import { Session, User } from 'better-auth';
import { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/utils';

export type UserSession = {
	user: User;
	session: Session;
};

export type MemberUserSession = {
	user: User;
	session: Session;
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
		let session: MemberUserSession | null = null;
		try {
			session = await getMemberSession();
		} catch (e) {
			return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
		}
		return await callback(req, session);
	} catch (e) {
		const message = getErrorMessage(e);
		console.log(e);
		console.log('withMemberAuth error', message);
		return NextResponse.json({ message }, { status: 500 });
	}
}

export async function getUserSession(options?: { redirectTo?: Route }): Promise<UserSession> {
	const res = await auth.api.getSession({ headers: await headers() });
	const user = res?.user;
	const session = res?.session;

	if (!user || !session) return redirect(options?.redirectTo ?? '/logga-in');

	return {
		user,
		session,
	} as UserSession;
}

export async function getMemberSession(options?: {
	headers?: Headers;
	redirectTo?: Route;
}): Promise<MemberUserSession> {
	const session = await getUserSession(options);
	const member = await findByEmail(session.user.email);
	if (!member) throw new Error('unauthorized');
	return { ...session, member } as MemberUserSession;
}
