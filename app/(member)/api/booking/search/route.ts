import { withMemberAuth } from '@/auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import { apiQuery } from 'next-dato-utils/api';
import { bookingSearchSchema } from '@/lib/schemas';
import { AllBookingsSearchDocument } from '@/graphql';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/booking/search'>) {
	//return withMemberAuth(req, async (req, session) => {
	try {
		const body = await req.json();
		console.log(body);
		const variables = bookingSearchSchema.parse(body);
		console.log({ variables });

		const { allBookings } = await apiQuery(AllBookingsSearchDocument, {
			all: true,
			variables,
		});
		console.log(allBookings);

		return new NextResponse(JSON.stringify(allBookings), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.log(e);
		const statusText = e instanceof Error ? e.message : (e as string);
		return new NextResponse('error', { status: 500, statusText });
	}
	//});
}
