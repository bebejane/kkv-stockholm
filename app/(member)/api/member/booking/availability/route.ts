import { withMemberAuth } from '@/auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import { apiQuery } from 'next-dato-utils/api';
import { BookingsAvailabilityDocument } from '@/graphql';
import { parseErrorMessage } from '@/lib/utils';
import { bookingAvilabilitySchema } from '@/lib/schemas/booking';

export async function POST(
	req: NextRequest,
	ctx: RouteContext<'/api/member/booking/availability'>,
) {
	return withMemberAuth(req, async (req) => {
		try {
			const body = await req.json();
			const variables = bookingAvilabilitySchema.parse(body);

			const { _allBookingsMeta, allBookings } = await apiQuery(BookingsAvailabilityDocument, {
				revalidate: 0,
				variables,
			});

			const available =
				_allBookingsMeta.count === 0 ||
				!allBookings.find((b) => b.equipment.find((e) => e.exclusive));

			return new NextResponse(JSON.stringify({ available }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			const statusText = parseErrorMessage(e);
			return new NextResponse('error', { status: 500, statusText });
		}
	});
}
