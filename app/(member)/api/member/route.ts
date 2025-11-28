import * as memberController from '@/lib/controllers/member';
import { parseErrorMessage } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		const member = await memberController.create(data);
		return new NextResponse(JSON.stringify(member), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.log(e);
		const statusText = parseErrorMessage(e);
		return new NextResponse('error', { status: 500, statusText });
	}
}
