import { withMemberAuth } from '@/auth/utils';
import { update, remove, find } from '@/lib/controllers/report';
import { find as findBooking } from '@/lib/controllers/booking';
import { linkId } from '@/lib/controllers/utils';
import { NextRequest, NextResponse } from 'next/server';

const forbidden = () => NextResponse.json({ message: 'forbidden' }, { status: 403 });

export async function GET(req: NextRequest, ctx: RouteContext<'/api/member/report/[report]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { report: id } = await ctx.params;
		const report = await find(id);
		if (!report) return new NextResponse(null, { status: 404 });
		if (linkId(report.member) !== session.member.id) return forbidden();

		return new NextResponse(JSON.stringify(report), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/member/report/[report]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { report: id } = await ctx.params;
		const data = await req.json();
		const report = await find(id);
		if (!report) return new NextResponse(null, { status: 404 });
		if (linkId(report.member) !== session.member.id) return forbidden();

		if (data.booking && data.booking !== report.booking?.id) {
			const booking = await findBooking(data.booking);
			if (!booking || linkId(booking.member) !== session.member.id) return forbidden();
		}

		const updated = await update(id, { ...data, member: session.member.id });
		return new NextResponse(JSON.stringify(updated), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/member/report/[report]'>) {
	return withMemberAuth(req, async (req, session) => {
		const { report: id } = await ctx.params;
		const report = await find(id);
		if (!report) return new NextResponse(null, { status: 404 });
		if (linkId(report.member) !== session.member.id) return forbidden();

		const result = await remove(id);
		return new NextResponse(JSON.stringify(result ?? null), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
