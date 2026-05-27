import { getAdminSession } from '@/auth/utils';
import * as spirisController from '@/lib/controllers/spiris';
import { parseErrorMessage } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const session = await getAdminSession();
	if (!session) {
		return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const body = await req.json();
		const { month, year } = body;

		if (typeof month !== 'number' || typeof year !== 'number') {
			return new NextResponse(JSON.stringify({ error: 'month and year are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const results = await spirisController.submitMonth(month, year);

		return new NextResponse(
			JSON.stringify({
				success: true,
				total: results.length,
				successful: results.filter((r) => r.success).length,
				failed: results.filter((r) => !r.success).length,
				results,
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch (e) {
		return new NextResponse(
			JSON.stringify({ error: parseErrorMessage(e) }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}
}
