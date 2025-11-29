import { withMemberAuth } from '@/auth/utils';
import { create } from '@/lib/controllers/booking';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/member/booking'>) {
	return withMemberAuth(req, async (req, session) => {
		const data = await req.json();
		const booking = await create(data);
		return new NextResponse(JSON.stringify(booking), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
