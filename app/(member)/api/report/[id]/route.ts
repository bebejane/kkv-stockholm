import { withMemberAuth } from '@/auth/utils';
import { create, update, remove, find } from '@/lib/controller/report';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/report/[id]'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const { id } = await ctx.params;
			const report = await find(id);
			return new NextResponse(JSON.stringify(report), {
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

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/report/[id]'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const { id } = await ctx.params;
			const data = await req.json();
			const report = await update(id, data);
			return new NextResponse(JSON.stringify(report), {
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

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/report/[id]'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const { id } = await ctx.params;
			const report = await remove(id);
			return new NextResponse(JSON.stringify(report), {
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
