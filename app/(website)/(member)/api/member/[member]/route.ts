import { withMemberAuth } from '@/auth/utils';
import { update, find } from '@/lib/controllers/member';
import { memberSelfUpdateSchema } from '@/lib/schemas/member';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/member/[member]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { member: id } = await ctx.params;
		if (session.member.id !== id)
			return NextResponse.json({ message: 'forbidden' }, { status: 403 });

		const member = await find(id);
		return new NextResponse(JSON.stringify(member), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/member/[member]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { member: id } = await ctx.params;
		if (session.member.id !== id)
			return NextResponse.json({ message: 'forbidden' }, { status: 403 });

		const data = await req.json();
		const member = await update(id, data, memberSelfUpdateSchema);
		return new NextResponse(JSON.stringify(member), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
