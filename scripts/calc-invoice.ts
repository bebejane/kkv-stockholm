import 'dotenv/config';
import { findWithLinked } from '../lib/controllers/utils';
import { buildInvoiceLines, buildInvoiceRows, sumInvoiceLines } from '../lib/spiris/cost';
import { findArticlesByNames } from '../lib/spiris/articles';
import { findDefaultArticleId } from '../lib/spiris/invoices';
import { format } from 'date-fns';

async function main() {
	const reportId = process.argv[2];
	if (!reportId) {
		console.error('Usage: tsx scripts/calc-invoice.ts <report-id>');
		process.exit(1);
	}

	const raw = await findWithLinked<any>(reportId, 2);
	if (!raw) {
		console.error(`Report ${reportId} not found`);
		process.exit(1);
	}

	// CMA client returns snake_case; cost.ts expects camelCase
	const report = {
		...raw,
		hours: raw.hours ?? raw.hour ?? null,
		days: raw.days ?? raw.day ?? null,
		extraCost: raw.extraCost ?? raw.extra_cost ?? null,
		workshop: {
			...(raw.workshop ?? {}),
			id: raw.workshop?.id ?? raw.workshop_id,
			title: raw.workshop?.title,
			titleLong: raw.workshop?.title_long ?? raw.workshop?.titleLong,
			priceDay: raw.workshop?.priceDay ?? raw.workshop?.price_day ?? 0,
			priceHour: raw.workshop?.priceHour ?? raw.workshop?.price_hour ?? 0,
			priceWeek: raw.workshop?.priceWeek ?? raw.workshop?.price_week ?? 0,
			priceMonth: raw.workshop?.priceMonth ?? raw.workshop?.price_month ?? 0,
		},
		assistants: (raw.assistants ?? []).map((a: any) => ({
			hours: a.hours ?? null,
			days: a.days ?? null,
		})),
	};

	const workshop = report.workshop;
	const dateStr = report.date ? format(new Date(report.date), 'dd MMM yyyy') : 'N/A';

	console.log('═══════════════════════════════════════════════════');
	console.log('REPORT');
	console.log('═══════════════════════════════════════════════════');
	console.log(`  ID:          ${report.id}`);
	console.log(`  Date:        ${dateStr}`);
	console.log(`  Member:      ${report.member?.email ?? 'N/A'}`);
	console.log(`  Invoice No:  ${report.invoiceNo ?? 'none'}`);
	console.log('');
	console.log('INPUT');
	console.log('───────────────────────────────────────────────────');
	console.log(`  Hours:       ${report.hours ?? 0}`);
	console.log(`  Days:        ${report.days ?? 0}`);
	console.log(`  Extra Cost:  ${report.extraCost ?? 0}`);
	if ((report.assistants ?? []).length > 0) {
		console.log(`  Assistants:  ${report.assistants.length}`);
		for (let i = 0; i < report.assistants.length; i++) {
			const a = report.assistants[i];
			console.log(`    [${i + 1}] hours=${a.hours ?? 0}, days=${a.days ?? 0}`);
		}
	}
	console.log('');
	console.log('WORKSHOP PRICES (excl. VAT)');
	console.log('───────────────────────────────────────────────────');
	console.log(`  Day:    ${workshop?.priceDay ?? 0} kr`);
	console.log(`  Hour:   ${workshop?.priceHour ?? 0} kr`);
	console.log(`  Week:   ${workshop?.priceWeek ?? 0} kr`);
	console.log(`  Month:  ${workshop?.priceMonth ?? 0} kr`);
	console.log('');

	const lines = buildInvoiceLines([report]);
	console.log('INVOICE LINES');
	console.log('═══════════════════════════════════════════════════');
	for (const line of lines) {
		const lineTotal = line.quantity * line.unitPrice;
		console.log(
			`  ${line.unit.padEnd(6)} ${String(line.quantity).padStart(5)} x ${line.unitPrice
				.toFixed(2)
				.padStart(10)} = ${lineTotal.toFixed(2).padStart(10)}  "${line.text}"`,
		);
	}
	const total = sumInvoiceLines(lines);
	const vat = total * 0.25;
	console.log('───────────────────────────────────────────────────');
	console.log(`  Moms (25%):        ${vat.toFixed(2)} kr`);
	console.log(`  TOTAL (excl. VAT): ${total.toFixed(2)} kr`);
	console.log(`  TOTAL (incl. VAT): ${(total + vat).toFixed(2)} kr`);

	try {
		const articleId = await findDefaultArticleId();
		const articleMap = await findArticlesByNames([
			'KKV tim',
			'KKV dag',
			'KKV-VECKA',
			'KKV månad',
			'KKV stycke',
		]);
		const unitArticles: Record<string, string> = {};
		if (articleMap.has('KKV tim')) unitArticles['tim'] = articleMap.get('KKV tim')!.Id;
		if (articleMap.has('KKV dag')) unitArticles['dag'] = articleMap.get('KKV dag')!.Id;
		if (articleMap.has('KKV-VECKA')) unitArticles['vecka'] = articleMap.get('KKV-VECKA')!.Id;
		if (articleMap.has('KKV månad')) unitArticles['mån'] = articleMap.get('KKV månad')!.Id;
		if (articleMap.has('KKV stycke')) unitArticles['st'] = articleMap.get('KKV stycke')!.Id;

		const rows = buildInvoiceRows([report], articleId, unitArticles);
		console.log('');
		console.log('SPIRIS ROWS');
		console.log('═══════════════════════════════════════════════════');
		for (const row of rows) {
			console.log(
				`  ${row.Quantity} x ${row.UnitPrice}  "${row.Text}"  [${row.ArticleId}]`,
			);
		}
	} catch {
		console.log('');
		console.log('SPIRIS ROWS');
		console.log('═══════════════════════════════════════════════════');
		console.log('  (Skipped - could not fetch SpirIS articles)');
	}
	console.log('═══════════════════════════════════════════════════');
}

main().catch((err) => {
	console.error('Error:', err instanceof Error ? err.message : err);
	process.exit(1);
});
