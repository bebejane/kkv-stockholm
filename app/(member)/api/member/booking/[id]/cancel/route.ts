import { withMemberAuth } from '@/auth/utils';
import { cancel } from '@/lib/controllers/booking';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
	req: NextRequest,
	ctx: RouteContext<'/api/member/booking/[id]/cancel'>,
) {
	return withMemberAuth(req, async (req, session) => {
		const { id } = await ctx.params;
		const booking = await cancel(id);
		return new NextResponse(JSON.stringify(booking), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
