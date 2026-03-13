import { withMemberAuth } from '@/auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import * as bookingController from '@/lib/controllers/booking';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/member/booking/search'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const body = await req.json();
			const bookings = await bookingController.search(body);
			return new NextResponse(JSON.stringify(bookings), {
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
