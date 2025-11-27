import { withMemberAuth } from '@/auth/utils';
import { create, update, remove, find } from '@/lib/controllers/member';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/member/[member]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { member: id } = await ctx.params;
		const report = await find(id);
		return new NextResponse(JSON.stringify(report), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/member/[member]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { member: id } = await ctx.params;
		const data = await req.json();
		const report = await update(id, data);
		return new NextResponse(JSON.stringify(report), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/member/[member]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { member: id } = await ctx.params;
		const report = await remove(id);
		return new NextResponse(JSON.stringify(report), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
