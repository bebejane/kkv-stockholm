import * as memberController from '@/lib/controller/member';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	console.log('/api/member');
	try {
		const data = await req.json();
		console.log('create member', data);
		console.log('creat function', memberController.create);
		const member = await memberController.create(data);
		console.log('creat function after');
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
