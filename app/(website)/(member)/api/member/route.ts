import * as memberController from '@/lib/controllers/member';
import { parseErrorMessage } from '@/lib/utils';
import { ApiError } from '@datocms/cma-client';
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
		if (e instanceof ApiError) console.log('api err');
		return new NextResponse(JSON.stringify({ error: parseErrorMessage(e) }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
