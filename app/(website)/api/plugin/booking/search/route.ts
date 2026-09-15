import { NextRequest, NextResponse } from 'next/server';
import { getDatoPluginSession, unauthorized } from '@/lib/dato-plugin-auth';
import * as bookingController from '@/lib/controllers/booking';
import { bookingSearchSchema } from '@/lib/schemas/booking';
import { errorResponse } from '@/lib/errors';

export async function POST(req: NextRequest) {
	const session = await getDatoPluginSession(req);
	if (!session) return unauthorized();

	try {
		const body = await req.json();
		const { equipmentIds, start, end, workshopId, mode } = bookingSearchSchema.parse(body);
		const bookings = await bookingController.search(
			{ equipmentIds, start, end, workshopId },
			session.user?.id ?? '',
			mode,
		);

		return new NextResponse(JSON.stringify(bookings), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		return errorResponse(e);
	}
}
