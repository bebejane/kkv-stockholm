import { getDatoPluginSession } from '@/lib/dato-plugin-auth';
import * as spirisController from '@/lib/controllers/spiris';
import type { SubmitMonthProgressEvent } from '@/lib/controllers/spiris';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const session = await getDatoPluginSession(req);
	if (!session)
		return Response.json({ error: 'Unauthorized' }, { status: 401 });

	let month: number;
	let year: number;

	try {
		const body = await req.json();
		({ month, year } = body);
	} catch {
		return Response.json({ error: 'Invalid request body' }, { status: 400 });
	}

	if (typeof month !== 'number' || typeof year !== 'number') {
		return Response.json({ error: 'month and year are required' }, { status: 400 });
	}

	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		async start(controller) {
			const send = (event: unknown) => {
				controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
			};

			try {
				const results = await spirisController.submitMonth(month, year, send);
				send({
					type: 'done',
					total: results.length,
					successful: results.filter((r) => r.success).length,
					failed: results.filter((r) => !r.success).length,
					results,
				});
			} catch (e) {
				console.error('spiris submit-month failed', e);
				send({ type: 'error', error: 'An unexpected error occurred' });
			} finally {
				controller.close();
			}
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'application/x-ndjson',
			'Cache-Control': 'no-store',
		},
	});
}
