import { withMemberAuth } from '@/auth/utils';
import { abort, find } from '@/lib/controllers/booking';
import { linkId } from '@/lib/controllers/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
	req: NextRequest,
	ctx: RouteContext<'/api/member/booking/[id]/abort'>,
) {
	return withMemberAuth(req, async (req, session) => {
		const { id } = await ctx.params;
		const booking = await find(id);
		if (!booking) return new NextResponse(null, { status: 404 });
		if (linkId(booking.member) !== session.member.id)
			return NextResponse.json({ message: 'forbidden' }, { status: 403 });

		const aborted = await abort(id);
		return new NextResponse(JSON.stringify(aborted), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
