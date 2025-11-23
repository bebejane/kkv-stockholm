import { create } from '@/lib/controller/member';
import { NextRequest, NextResponse } from 'next/server';

//export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	console.log('/api/member');
	try {
		const data = await req.json();
		const member = await create(data);
		return new NextResponse(JSON.stringify(member), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.log(e);
		const statusText = e instanceof Error ? e.message : (e as string);
		return new NextResponse('error', { status: 500, statusText });
	}
}
