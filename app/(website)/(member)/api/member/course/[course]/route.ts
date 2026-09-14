import { withMemberAuth } from '@/auth/utils';
import { update, remove, find } from '@/lib/controllers/course';
import { linkId } from '@/lib/controllers/utils';
import { NextRequest, NextResponse } from 'next/server';

const forbidden = () => NextResponse.json({ message: 'forbidden' }, { status: 403 });

export async function GET(req: NextRequest, ctx: RouteContext<'/api/member/course/[course]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { course: id } = await ctx.params;
		const course = await find(id);
		if (!course) return new NextResponse(null, { status: 404 });
		if (linkId(course.member) !== session.member.id) return forbidden();

		return new NextResponse(JSON.stringify(course), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/member/course/[course]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { course: id } = await ctx.params;
		const data = await req.json();
		const course = await find(id);
		if (!course) return new NextResponse(null, { status: 404 });
		if (linkId(course.member) !== session.member.id) return forbidden();

		const updated = await update(id, { ...data, member: session.member.id });
		return new NextResponse(JSON.stringify(updated), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/member/course/[course]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { course: id } = await ctx.params;
		const course = await find(id);
		if (!course) return new NextResponse(null, { status: 404 });
		if (linkId(course.member) !== session.member.id) return forbidden();

		const result = await remove(id);
		return new NextResponse(JSON.stringify(result ?? null), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
