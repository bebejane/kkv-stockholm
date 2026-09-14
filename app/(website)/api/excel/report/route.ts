import { getAdminApiSession } from '@/auth/utils';
import { generateMonthReport } from '@/lib/controllers/report';
import { tzDate } from '@/lib/dates';

export async function GET(req: Request) {
	const session = await getAdminApiSession();
	if (!session) return new Response('unauthorized', { status: 401 });

	try {
		const d = new URL(req.url).searchParams.get('date');
		const date = tzDate(d ? new Date(d) : new Date());
		if (isNaN(date.getTime())) return new Response('invalid date', { status: 400 });

		const buffer = await generateMonthReport(date);
		return new Response(buffer as BodyInit, {
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': 'attachment; filename="manadsrapport.xlsx"',
			},
		});
	} catch (e) {
		console.error('excel/report failed', e);
		return new Response('error', { status: 500 });
	}
}
