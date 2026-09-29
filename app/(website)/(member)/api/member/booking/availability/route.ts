import { withMemberAuth } from '@/auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import { bookingAvilabilityMemberSchema } from '@/lib/schemas/booking';
import { errorResponse } from '@/lib/errors';
import * as bookingController from '@/lib/controllers/booking';

export async function POST(req: NextRequest) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const body = await req.json();
			// `mode` is intentionally ignored: member requests always use 'edit'.
			const { start, end, workshopId, equipmentIds } =
				bookingAvilabilityMemberSchema.parse(body);

			const available = await bookingController.availability(
				{
					start,
					end,
					workshop: workshopId,
					equipment: equipmentIds,
				},
				session.user.id,
				'edit',
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
