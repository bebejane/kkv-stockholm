import { withMemberAuth } from '@/auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import * as bookingController from '@/lib/controllers/booking';
import { bookingSearchMemberSchema } from '@/lib/schemas/booking';
import { errorResponse } from '@/lib/errors';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/member/booking/search'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const body = await req.json();
			// `mode` is intentionally ignored: member requests always use 'edit'
			// scope so other members' bookings are never returned.
			const { equipmentIds, start, end, workshopId } = bookingSearchMemberSchema.parse(body);
			const bookings = await bookingController.search(
				{ equipmentIds, start, end, workshopId },
				session.user.id,
				'edit',
			);

			return new NextResponse(JSON.stringify(bookings), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			return errorResponse(e);
		}
	});
}
