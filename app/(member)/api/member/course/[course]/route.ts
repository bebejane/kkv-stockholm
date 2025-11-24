import { withMemberAuth } from '@/auth/utils';
import { update, remove, find } from '@/lib/controller/course';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/member/course/[course]'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const { course: id } = await ctx.params;
			const course = await find(id);
			return new NextResponse(JSON.stringify(course), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			console.log(e);
			const statusText = e instanceof Error ? e.message : (e as string);
			return new NextResponse('error', { status: 500, statusText });
		}
	});
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/member/course/[course]'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const { course: id } = await ctx.params;
			const data = await req.json();
			const course = await update(id, data);
			return new NextResponse(JSON.stringify(course), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			console.log(e);
			const statusText = e instanceof Error ? e.message : (e as string);
			return new NextResponse('error', { status: 500, statusText });
		}
	});
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/member/course/[course]'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const { course: id } = await ctx.params;
			const course = await remove(id);
			return new NextResponse(JSON.stringify(course), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			console.log(e);
			const statusText = e instanceof Error ? e.message : (e as string);
			return new NextResponse('error', { status: 500, statusText });
		}
	});
}
