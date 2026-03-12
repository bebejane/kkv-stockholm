import { withMemberAuth } from '@/auth/utils';
import { update, remove, find } from '@/lib/controllers/course';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/member/course/[course]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { course: id } = await ctx.params;
		const course = await find(id);
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
		const course = await update(id, data);
		return new NextResponse(JSON.stringify(course), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/member/course/[course]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { course: id } = await ctx.params;
		const course = await remove(id);
		return new NextResponse(JSON.stringify(course), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
