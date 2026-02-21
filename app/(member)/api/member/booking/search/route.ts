import { withMemberAuth } from '@/auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import { apiQuery } from 'next-dato-utils/api';
import { bookingSearchSchema } from '@/lib/schemas/booking';
import { AllBookingsSearchDocument } from '@/graphql';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/member/booking/search'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const body = await req.json();
			const variables = bookingSearchSchema.parse(body);
			console.log('booking search', variables);
			const { allBookings } = await apiQuery(AllBookingsSearchDocument, {
				all: true,
				revalidate: 0,
				variables,
			});

			return new NextResponse(JSON.stringify(allBookings), {
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
