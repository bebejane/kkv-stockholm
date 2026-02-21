import { generateMonthReport } from '@/lib/controllers/report';
import { tzDate } from '@/lib/dates';
import { parseErrorMessage } from '@/lib/utils';

export async function GET(req: Request) {
	try {
		const d = new URL(req.url).searchParams.get('date') ?? new Date();
		const date = tzDate(d);
		const buffer = await generateMonthReport(date);
		return new Response(buffer as BodyInit, {
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			},
		});
	} catch (e) {
		const statusText = parseErrorMessage(e);
		return new Response('error', { status: 500, statusText });
	}
}
