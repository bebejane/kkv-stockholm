import { NextRequest } from 'next/server';
import { subMonths } from 'date-fns';
import { createAutoReportsForMonth } from '@/lib/controllers/report';

export const dynamic = 'force-dynamic';

/**
 * Vercel cron: runs on the 1st of each month and creates reports for all
 * bookings that ended last month, are not aborted and have no report yet.
 *
 * Manual runs can target a specific month with a 0-based `?month=` (0 = January),
 * e.g. `?month=8&year=2026` for September.
 */
export async function GET(req: NextRequest) {
	const authorization = req.headers.get('authorization');
	if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response('Access denied', { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const monthParam = searchParams.get('month');
	const yearParam = searchParams.get('year');

	const target =
		monthParam && yearParam
			? new Date(Number(yearParam), Number(monthParam), 1)
			: subMonths(new Date(), 1);

	try {
		const summary = await createAutoReportsForMonth(target);
		console.log('auto-reports: results');
		console.log(JSON.stringify(summary, null, 2));
		return Response.json(summary);
	} catch (e) {
		console.error('auto-reports failed', e);
		return Response.json(
			{ error: e instanceof Error ? e.message : 'Unknown error' },
			{ status: 500 },
		);
	}
}
