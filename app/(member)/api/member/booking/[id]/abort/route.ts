import { withMemberAuth } from '@/auth/utils';
import { abort } from '@/lib/controllers/booking';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
	req: NextRequest,
	ctx: RouteContext<'/api/member/booking/[id]/abort'>,
) {
	return withMemberAuth(req, async (req, session) => {
		const { id } = await ctx.params;
		const booking = await abort(id);
		return new NextResponse(JSON.stringify(booking), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
