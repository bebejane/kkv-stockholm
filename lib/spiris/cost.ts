type ReportLike = {
	hours?: number | null;
	days?: number | null;
	extraCost?: number | null;
	workshop: {
		priceDay?: number | null;
		priceHour?: number | null;
		priceWeek?: number | null;
		priceMonth?: number | null;
	};
	assistants?: { hours?: number | null; days?: number | null }[];
};

type InvoiceRow = {
	ArticleId: string;
	Text: string;
	Quantity: number;
	UnitPrice: number;
};

const VAT_FACTOR = 1 - 0.25;
//const VAT_FACTOR = 1;

export type UnitBreakdown = {
	months: number;
	weeks: number;
	days: number;
	hours: number;
	extraCost: number;
};

function convertUnits(hours: number, days: number) {
	let totalDays = days;

	if (hours > 0) {
		totalDays += Math.ceil(hours / 5);
	}

	return { months: 0, weeks: 0, days: totalDays, hours: 0 };
}

export function calculateUnitBreakdown(hours: number, days: number): UnitBreakdown {
	const { months, weeks, days: d, hours: h } = convertUnits(hours, days);
	return { months, weeks, days: d, hours: h, extraCost: 0 };
}

export function calculateReportRows(report: ReportLike): UnitBreakdown {
	const { months, weeks, days, hours } = convertUnits(report.hours ?? 0, report.days ?? 0);
	return { months, weeks, days, hours, extraCost: report.extraCost ?? 0 };
}

export function calculateReportCost(report: ReportLike): number {
	const breakdown = calculateReportRows(report);
	const priceDay = report.workshop.priceDay ?? 0;
	const priceHour = report.workshop.priceHour ?? 0;
	const priceWeek = report.workshop.priceWeek ?? 0;
	const priceMonth = report.workshop.priceMonth ?? 0;

	let total =
		breakdown.months * priceMonth +
		breakdown.weeks * priceWeek +
		breakdown.days * priceDay +
		breakdown.hours * priceHour +
		breakdown.extraCost;

	for (const assistant of report.assistants ?? []) {
		const ab = calculateUnitBreakdown(assistant.hours ?? 0, assistant.days ?? 0);
		total +=
			ab.months * priceMonth + ab.weeks * priceWeek + ab.days * priceDay + ab.hours * priceHour;
	}

	return total;
}

function pushUnitRows(
	rows: InvoiceRow[],
	breakdown: UnitBreakdown,
	articleFor: (unit: string) => string,
	description: string,
	priceMonth: number,
	priceWeek: number,
	priceDay: number,
	priceHour: number,
) {
	if (breakdown.months > 0) {
		rows.push({
			ArticleId: articleFor('mån'),
			Text: description,
			Quantity: breakdown.months,
			UnitPrice: priceMonth * VAT_FACTOR,
		});
	}
	if (breakdown.weeks > 0) {
		rows.push({
			ArticleId: articleFor('vecka'),
			Text: description,
			Quantity: breakdown.weeks,
			UnitPrice: priceWeek * VAT_FACTOR,
		});
	}
	if (breakdown.days > 0) {
		rows.push({
			ArticleId: articleFor('dag'),
			Text: description,
			Quantity: breakdown.days,
			UnitPrice: priceDay * VAT_FACTOR,
		});
	}
	if (breakdown.hours > 0) {
		rows.push({
			ArticleId: articleFor('tim'),
			Text: description,
			Quantity: breakdown.hours,
			UnitPrice: priceHour * VAT_FACTOR,
		});
	}
	if (breakdown.extraCost > 0) {
		rows.push({
			ArticleId: articleFor('st'),
			Text: description,
			Quantity: 1,
			UnitPrice: breakdown.extraCost * VAT_FACTOR,
		});
	}
}

export function buildInvoiceRows(
	report: ReportLike,
	articleId: string,
	description: string,
	unitArticles?: Record<string, string>,
): InvoiceRow[] {
	const breakdown = calculateReportRows(report);
	const priceDay = report.workshop.priceDay ?? 0;
	const priceHour = report.workshop.priceHour ?? 0;
	const priceWeek = report.workshop.priceWeek ?? 0;
	const priceMonth = report.workshop.priceMonth ?? 0;

	const articleFor = (unit: string): string => unitArticles?.[unit] ?? articleId;

	const rows: InvoiceRow[] = [];

	pushUnitRows(
		rows,
		breakdown,
		articleFor,
		description,
		priceMonth,
		priceWeek,
		priceDay,
		priceHour,
	);

	for (const assistant of report.assistants ?? []) {
		const ab = calculateUnitBreakdown(assistant.hours ?? 0, assistant.days ?? 0);
		pushUnitRows(
			rows,
			ab,
			articleFor,
			`${description} (assistent)`,
			priceMonth,
			priceWeek,
			priceDay,
			priceHour,
		);
	}

	return rows;
}
