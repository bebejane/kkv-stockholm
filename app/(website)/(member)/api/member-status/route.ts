import { basicAuth } from 'next-dato-utils/route-handlers';
import * as memberController from '@/lib/controllers/member';
import { errorResponse, BadRequestError, NotFoundError } from '@/lib/errors';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	return basicAuth(request, async (req: Request) => {
		try {
			const body = await req.json();
			const memberId = body?.entity?.id;
			if (!memberId) throw new BadRequestError('Invalid memberId');

			const member = await memberController.find(memberId);
			if (!member) throw new NotFoundError('Member', memberId);

			const status = await memberController.handleMemberChange(member.email as string);
			return new Response(JSON.stringify({ status: status, member: member.email }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			return errorResponse(e);
		}
	});
}
