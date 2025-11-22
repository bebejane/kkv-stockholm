import { withMemberAuth } from '@/auth/utils';
import { create } from '@/lib/controller/report';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const data = await req.json();
			const report = await create(data);
			return new NextResponse(JSON.stringify(report), {
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
