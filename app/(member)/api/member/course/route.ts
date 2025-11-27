import { withMemberAuth } from '@/auth/utils';
import * as courseController from '@/lib/controller/course';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/member/course'>) {
	return withMemberAuth(req, async (req, session) => {
		const data = await req.json();
		const course = await courseController.create(data);
		return new NextResponse(JSON.stringify(course), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	});
}
