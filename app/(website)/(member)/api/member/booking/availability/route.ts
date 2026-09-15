import { withMemberAuth } from '@/auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import { bookingAvilabilitySchema } from '@/lib/schemas/booking';
import { errorResponse } from '@/lib/errors';
import * as bookingController from '@/lib/controllers/booking';

export async function POST(req: NextRequest) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const body = await req.json();
			const { start, end, workshopId, equipmentIds, mode } = bookingAvilabilitySchema.parse(body);

			const available = await bookingController.availability(
				{
					start,
					end,
					workshop: workshopId,
					equipment: equipmentIds,
				},
				session.user.id,
				mode,
			);

			return new NextResponse(JSON.stringify({ available }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			return errorResponse(e);
		}
	});
}
