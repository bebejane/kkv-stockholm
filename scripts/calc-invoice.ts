import 'dotenv/config';
import { findWithLinked } from '../lib/controllers/utils';
import { calculateReportRows, calculateReportCost, calculateUnitBreakdown, buildInvoiceRows } from '../lib/spiris/cost';
import { findArticlesByNames } from '../lib/spiris/articles';
import { findDefaultArticleId } from '../lib/spiris/invoices';
import { format } from 'date-fns';

type ReportLinked = {
	id: string;
	date: string;
	hours?: number | null;
	days?: number | null;
	extraCost?: number | null;
	invoiceNo?: string | null;
	workshop: {
		title?: string | null;
		titleLong?: string | null;
		priceDay?: number | null;
		priceHour?: number | null;
		priceWeek?: number | null;
		priceMonth?: number | null;
	};
	member?: { email?: string | null } | null;
	booking?: {
		equipment?: { title?: string | null; titleShort?: string | null }[];
		workshop?: { title?: string | null } | null;
		start?: string | null;
		end?: string | null;
	} | null;
	assistants: { hours?: number | null; days?: number | null }[];
};

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
	} as unknown as ReportLinked;

	const workshop = report.workshop;
	const workshopTitle = report.booking?.workshop?.title ?? workshop?.title ?? (workshop?.titleLong || 'Workshop');
	const equipmentNames = (report.booking?.equipment ?? [])
		.map((e) => e.titleShort || e.title || '')
		.filter(Boolean)
		.join(', ');
	const dateStr = format(new Date(report.date), 'dd MMM yyyy');
	const description = equipmentNames
		? `${workshopTitle} - (${equipmentNames}) - ${dateStr}`
		: `${workshopTitle} - ${dateStr}`;

	console.log('═══════════════════════════════════════════════════');
	console.log('REPORT');
	console.log('═══════════════════════════════════════════════════');
	console.log(`  ID:          ${report.id}`);
	console.log(`  Date:        ${dateStr}`);
	console.log(`  Workshop:    ${workshopTitle}`);
	console.log(`  Member:      ${report.member?.email ?? 'N/A'}`);
	console.log(`  Invoice No:  ${report.invoiceNo ?? 'none'}`);
	console.log('');
	console.log('INPUT');
	console.log('───────────────────────────────────────────────────');
	console.log(`  Hours:       ${report.hours ?? 0}`);
	console.log(`  Days:        ${report.days ?? 0}`);
	console.log(`  Extra Cost:  ${report.extraCost ?? 0}`);
	if (report.assistants.length > 0) {
		console.log(`  Assistants:  ${report.assistants.length}`);
		for (let i = 0; i < report.assistants.length; i++) {
			const a = report.assistants[i];
			console.log(`    [${i + 1}] hours=${a.hours ?? 0}, days=${a.days ?? 0}`);
		}
	}
	console.log('');

	const priceDay = workshop?.priceDay ?? 0;
	const priceHour = workshop?.priceHour ?? 0;
	const priceWeek = workshop?.priceWeek ?? 0;
	const priceMonth = workshop?.priceMonth ?? 0;

	console.log('WORKSHOP PRICES (excl. VAT)');
	console.log('───────────────────────────────────────────────────');
	console.log(`  Day:    ${priceDay} kr`);
	console.log(`  Hour:   ${priceHour} kr`);
	console.log(`  Week:   ${priceWeek} kr`);
	console.log(`  Month:  ${priceMonth} kr`);
	console.log('');

	const breakdown = calculateReportRows(report);
	console.log('BREAKDOWN (report)');
	console.log('───────────────────────────────────────────────────');
	console.log(`  Months:  ${breakdown.months}`);
	console.log(`  Weeks:   ${breakdown.weeks}`);
	console.log(`  Days:    ${breakdown.days}`);
	console.log(`  Hours:   ${breakdown.hours}`);
	console.log(`  Extra:   ${breakdown.extraCost}`);
	console.log('');

	if (report.assistants.length > 0) {
		console.log('BREAKDOWN (assistants)');
		console.log('───────────────────────────────────────────────────');
		for (let i = 0; i < report.assistants.length; i++) {
			const a = report.assistants[i];
			const ab = calculateUnitBreakdown(a.hours ?? 0, a.days ?? 0);
			console.log(`  [${i + 1}] months=${ab.months} weeks=${ab.weeks} days=${ab.days} hours=${ab.hours}`);
		}
		console.log('');
	}

	const total = calculateReportCost(report);
	console.log('TOTAL (excl. VAT)');
	console.log('───────────────────────────────────────────────────');
	console.log(`  ${total} kr`);
	console.log('');

	try {
		const articleId = await findDefaultArticleId();
		const articleMap = await findArticlesByNames(['KKV tim', 'KKV dag', 'KKV-VECKA', 'KKV månad', 'KKV stycke']);
		const unitArticles: Record<string, string> = {};
		if (articleMap.has('KKV tim')) unitArticles['tim'] = articleMap.get('KKV tim')!.Id;
		if (articleMap.has('KKV dag')) unitArticles['dag'] = articleMap.get('KKV dag')!.Id;
		if (articleMap.has('KKV-VECKA')) unitArticles['vecka'] = articleMap.get('KKV-VECKA')!.Id;
		if (articleMap.has('KKV månad')) unitArticles['mån'] = articleMap.get('KKV månad')!.Id;
		if (articleMap.has('KKV stycke')) unitArticles['st'] = articleMap.get('KKV stycke')!.Id;

		const rows = buildInvoiceRows(report, articleId, description, unitArticles);

		console.log('INVOICE ROWS');
		console.log('═══════════════════════════════════════════════════');
		let rowTotal = 0;
		for (const row of rows) {
			const lineTotal = row.Quantity * row.UnitPrice;
			rowTotal += lineTotal;
			const articleName = Object.entries(unitArticles).find(([, id]) => id === row.ArticleId)?.[0] ?? 'default';
			console.log(`  ${articleName.padEnd(8)} ${String(row.Quantity).padStart(5)} x ${String(row.UnitPrice.toFixed(2)).padStart(10)} = ${lineTotal.toFixed(2)}  "${row.Text}"`);
		}
		console.log('───────────────────────────────────────────────────');
		console.log(`  TOTAL (incl. 25% VAT): ${rowTotal.toFixed(2)} kr`);
	} catch (e) {
		console.log('INVOICE ROWS');
	console.log('═══════════════════════════════════════════════════');
		console.log('  (Skipped - could not fetch SpirIS articles)');
	}

	console.log('═══════════════════════════════════════════════════');
}

main().catch((err) => {
	console.error('Error:', err instanceof Error ? err.message : err);
	process.exit(1);
});
