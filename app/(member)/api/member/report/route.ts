import { withMemberAuth } from '@/auth/utils';
import { create } from '@/lib/controller/report';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/member/report'>) {
	return withMemberAuth(req, async (req, session) => {
		const data = await req.json();
		const report = await create(data);
		return new NextResponse(JSON.stringify(report), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
