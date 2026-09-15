import { getAdminApiSession } from '@/auth/utils';
import * as spirisController from '@/lib/controllers/spiris';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const session = await getAdminApiSession();
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const body = await req.json();
		const { month, year } = body;

		if (typeof month !== 'number' || typeof year !== 'number') {
			return NextResponse.json({ error: 'month and year are required' }, { status: 400 });
		}

		const results = await spirisController.submitMonth(month, year);

		return NextResponse.json({
			success: true,
			total: results.length,
			successful: results.filter((r) => r.success).length,
			failed: results.filter((r) => !r.success).length,
			results,
		});
	} catch (e) {
		console.error('spiris submit-month failed', e);
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}
