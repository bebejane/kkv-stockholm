import { format } from 'date-fns';

export type ReportLike = {
	id?: string;
	date?: string | Date | null;
	hours?: number | null;
	days?: number | null;
	extraCost?: number | null;
	workshop: {
		id?: string | null;
		title?: string | null;
		titleLong?: string | null;
		priceDay?: number | null;
		priceHour?: number | null;
		priceWeek?: number | null;
		priceMonth?: number | null;
	};
	booking?: {
		equipment?: { title?: string | null; titleShort?: string | null }[] | null;
		workshop?: { title?: string | null } | null;
	} | null;
	assistants?: { hours?: number | null; days?: number | null }[] | null;
};

export type InvoiceUnit = 'mån' | 'dag' | 'tim' | 'st';

export type InvoiceLine = {
	workshopId?: string;
	unit: InvoiceUnit;
	quantity: number;
	unitPrice: number;
	text: string;
	isAssistant: boolean;
	isExtra: boolean;
};

export type InvoiceRow = {
	ArticleId: string;
	Text: string;
	Quantity: number;
	UnitPrice: number;
};

type WorkshopPrices = {
	priceDay: number;
	priceHour: number;
	priceMonth: number;
};

// ── Descriptions ────────────────────────────────────────────────────────────

function reportTitle(report: ReportLike): string {
	return (
		report.booking?.workshop?.title ??
		report.workshop?.title ??
		report.workshop?.titleLong ??
		'Workshop'
	);
}

function equipmentNames(reports: ReportLike[]): string {
	const names = new Set<string>();
	for (const report of reports) {
		for (const equipment of report.booking?.equipment ?? []) {
			const name = equipment.titleShort || equipment.title;
			if (name) names.add(name);
		}
	}
	return Array.from(names).join(', ');
}

function formatDateRange(reports: ReportLike[]): string {
	const times = reports
		.map((report) => (report.date ? new Date(report.date).getTime() : NaN))
		.filter((time) => !Number.isNaN(time));

	if (times.length === 0) return '';

	const min = new Date(Math.min(...times));
	const max = new Date(Math.max(...times));

	if (min.getTime() === max.getTime()) return format(min, 'dd MMM').toLowerCase();
	if (min.getMonth() === max.getMonth() && min.getFullYear() === max.getFullYear())
		return `${format(min, 'dd')}–${format(max, 'dd MMM').toLowerCase()}`;

	return `${format(min, 'dd MMM').toLowerCase()} – ${format(max, 'dd MMM').toLowerCase()}`;
}

export function buildReportDescription(report: ReportLike): string {
	const title = reportTitle(report);
	const equipment = equipmentNames([report]);
	const base = equipment ? `${title} - (${equipment})` : title;
	const date = report.date ? format(new Date(report.date), 'dd MMM').toLowerCase() : '';
	return date ? `${base} - ${date}` : base;
}

export function buildGroupDescription(reports: ReportLike[]): string {
	const title = reportTitle(reports[0]);
	const equipment = equipmentNames(reports);
	const range = formatDateRange(reports);
	const base = equipment ? `${title} - (${equipment})` : title;
	return range ? `${base} - ${range}` : base;
}

// ── Pricing ─────────────────────────────────────────────────────────────────

/**
 * Prices the member's own time for one combined workshop group.
 *
 * - every full 5 hours counts as one day: `days + floor(hours / 5)`
 * - the remaining hours (< 5) are billed hourly
 * - the result is capped at `priceMonth` (emitted as a single month line)
 */
function ownTimeLines(
	days: number,
	hours: number,
	prices: WorkshopPrices,
	text: string,
	workshopId?: string,
): InvoiceLine[] {
	const make = (unit: InvoiceUnit, quantity: number, unitPrice: number): InvoiceLine => ({
		workshopId,
		unit,
		quantity,
		unitPrice,
		text,
		isAssistant: false,
		isExtra: false,
	});

	const totalDays = days + Math.floor(hours / 5);
	const remainingHours = hours % 5;

	const lines: InvoiceLine[] = [];
	if (totalDays > 0) lines.push(make('dag', totalDays, prices.priceDay));
	if (remainingHours > 0) lines.push(make('tim', remainingHours, prices.priceHour));

	const total = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
	if (prices.priceMonth > 0 && total > prices.priceMonth) {
		return [make('mån', 1, prices.priceMonth)];
	}

	return lines;
}

function assistantLines(
	report: ReportLike,
	prices: WorkshopPrices,
	text: string,
	workshopId?: string,
): InvoiceLine[] {
	const lines: InvoiceLine[] = [];

	for (const assistant of report.assistants ?? []) {
		// Mirror the member's own time: full 5-hour blocks become days, and the
		// remainder is billed hourly (no rounding a partial block up to a day).
		const totalDays = (assistant.days ?? 0) + Math.floor((assistant.hours ?? 0) / 5);
		const remainingHours = (assistant.hours ?? 0) % 5;

		if (totalDays > 0) {
			lines.push({
				workshopId,
				unit: 'dag',
				quantity: totalDays,
				unitPrice: prices.priceDay,
				text: `${text} (assistent)`,
				isAssistant: true,
				isExtra: false,
			});
		}
		if (remainingHours > 0) {
			lines.push({
				workshopId,
				unit: 'tim',
				quantity: remainingHours,
				unitPrice: prices.priceHour,
				text: `${text} (assistent)`,
				isAssistant: true,
				isExtra: false,
			});
		}
	}

	return lines;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Builds the priced lines for a member's invoice: reports are combined by
 * workshop, the member's own time is summed and converted once, while
 * assistants and extra costs stay as separate rows per report.
 */
export function buildInvoiceLines(reports: ReportLike[]): InvoiceLine[] {
	const lines: InvoiceLine[] = [];

	const groups = new Map<string, ReportLike[]>();
	for (const report of reports) {
		const key = report.workshop?.id ?? reportTitle(report);
		const group = groups.get(key);
		if (group) group.push(report);
		else groups.set(key, [report]);
	}

	for (const [workshopId, groupReports] of groups) {
		const workshop = groupReports[0].workshop;
		const prices: WorkshopPrices = {
			priceDay: workshop?.priceDay ?? 0,
			priceHour: workshop?.priceHour ?? 0,
			priceMonth: workshop?.priceMonth ?? 0,
		};

		const days = groupReports.reduce((sum, report) => sum + (report.days ?? 0), 0);
		const hours = groupReports.reduce((sum, report) => sum + (report.hours ?? 0), 0);

		lines.push(
			...ownTimeLines(days, hours, prices, buildGroupDescription(groupReports), workshopId),
		);

		for (const report of groupReports) {
			const text = buildReportDescription(report);
			lines.push(...assistantLines(report, prices, text, workshopId));

			const extraCost = report.extraCost ?? 0;
			if (extraCost > 0) {
				lines.push({
					workshopId,
					unit: 'st',
					quantity: 1,
					unitPrice: extraCost,
					text,
					isAssistant: false,
					isExtra: true,
				});
			}
		}
	}

	return lines;
}

export type InvoiceLineGroup = {
	workshopId: string;
	title: string;
	/** Combined member lines (per workshop) before assistants/extra. */
	lines: InvoiceLine[];
	/** Per-report assistant lines. */
	assistants: InvoiceLine[];
	/** Per-report extra-cost lines. */
	extra: InvoiceLine[];
	total: number;
};

/**
 * Groups priced invoice lines by workshop, keeping the member's own lines,
 * assistants and extra costs in separate buckets with a running total each.
 * Shared by the server-side month breakdown and the plugin invoice preview.
 */
export function groupInvoiceLines(reports: ReportLike[]): InvoiceLineGroup[] {
	const titles = new Map<string, string>();
	for (const report of reports) {
		const workshopId = report.workshop?.id;
		if (workshopId && !titles.has(workshopId)) {
			titles.set(
				workshopId,
				report.booking?.workshop?.title ??
					report.workshop?.title ??
					report.workshop?.titleLong ??
					'Workshop',
			);
		}
	}

	const groups = new Map<string, InvoiceLineGroup>();
	for (const line of buildInvoiceLines(reports)) {
		const key = line.workshopId ?? 'unknown';
		let group = groups.get(key);
		if (!group) {
			group = {
				workshopId: key,
				title: titles.get(key) ?? 'Workshop',
				lines: [],
				assistants: [],
				extra: [],
				total: 0,
			};
			groups.set(key, group);
		}

		if (line.isAssistant) group.assistants.push(line);
		else if (line.isExtra) group.extra.push(line);
		else group.lines.push(line);

		group.total += line.quantity * line.unitPrice;
	}

	return Array.from(groups.values());
}

export function sumInvoiceLines(lines: InvoiceLine[]): number {
	return lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
}

export function buildInvoiceRows(
	reports: ReportLike[],
	articleId: string,
	unitArticles?: Record<string, string>,
): InvoiceRow[] {
	const articleFor = (unit: string): string => unitArticles?.[unit] ?? articleId;

	return buildInvoiceLines(reports).map((line) => ({
		ArticleId: articleFor(line.unit),
		Text: line.text,
		Quantity: line.quantity,
		UnitPrice: line.unitPrice,
	}));
}
