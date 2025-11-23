import { create } from '@/lib/controller/member';
import { findById, generateVerificationToken, getItemTypeIds } from '@/lib/controller/utils';
import { NextRequest, NextResponse } from 'next/server';

//export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
	console.log('/api/test');
	try {
		const token = await generateVerificationToken('bebe@bebe.com');
		console.log(create);

		return new NextResponse(JSON.stringify({ token }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.log(e);
		const statusText = e instanceof Error ? e.message : (e as string);
		return new NextResponse('error', { status: 500, statusText });
	}
}
