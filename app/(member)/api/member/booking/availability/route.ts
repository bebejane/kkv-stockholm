import { withMemberAuth } from '@/auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import { parseErrorMessage } from '@/lib/utils';
import { bookingAvilabilitySchema } from '@/lib/schemas/booking';
import { validate } from '@/lib/controllers/booking';

export async function POST(req: NextRequest) {
	return withMemberAuth(req, async (req) => {
		try {
			const body = await req.json();
			const variables = bookingAvilabilitySchema.parse(body);

			try {
				await validate(variables);
				return new NextResponse(JSON.stringify({ available: true }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			} catch (e) {
				console.log(e);
				return new NextResponse(JSON.stringify({ available: false }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			}
		} catch (e) {
			const statusText = parseErrorMessage(e);
			return new NextResponse('error', { status: 500, statusText });
		}
	});
}
