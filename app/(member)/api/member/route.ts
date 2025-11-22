import { create } from '@/lib/controller/member';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/member/[member]/report'>) {
	try {
		const { member: memberId } = await ctx.params;
		const data = await req.json();
		const member = await create(data);
		return new NextResponse(JSON.stringify(member), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.log(e);
		const statusText = e instanceof Error ? e.message : (e as string);
		return new NextResponse('error', { status: 500, statusText });
	}
}
