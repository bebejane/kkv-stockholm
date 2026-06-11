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

export type UnitBreakdown = {
	months: number;
	weeks: number;
	days: number;
	hours: number;
	extraCost: number;
};

function convertUnits(hours: number, days: number) {
	const totalInHours = hours + days * 5;

	const months = Math.floor(totalInHours / (30 * 5));
	const afterMonths = totalInHours % (30 * 5);

	const weeks = Math.floor(afterMonths / (5 * 5));
	const afterWeeks = afterMonths % (5 * 5);

	const remainingDays = Math.floor(afterWeeks / 5);
	const remainingHours = afterWeeks % 5;

	return { months, weeks, days: remainingDays, hours: remainingHours };
}

export function calculateUnitBreakdown(
	hours: number,
	days: number,
): UnitBreakdown {
	const { months, weeks, days: d, hours: h } = convertUnits(hours, days);
	return { months, weeks, days: d, hours: h, extraCost: 0 };
}

export function calculateReportRows(report: ReportLike): UnitBreakdown {
	const { months, weeks, days, hours } = convertUnits(
		report.hours ?? 0,
		report.days ?? 0,
	);
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
		const ab = calculateUnitBreakdown(
			assistant.hours ?? 0,
			assistant.days ?? 0,
		);
		total +=
			ab.months * priceMonth +
			ab.weeks * priceWeek +
			ab.days * priceDay +
			ab.hours * priceHour;
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
			UnitPrice: priceMonth,
		});
	}
	if (breakdown.weeks > 0) {
		rows.push({
			ArticleId: articleFor('vecka'),
			Text: description,
			Quantity: breakdown.weeks,
			UnitPrice: priceWeek,
		});
	}
	if (breakdown.days > 0) {
		rows.push({
			ArticleId: articleFor('dag'),
			Text: description,
			Quantity: breakdown.days,
			UnitPrice: priceDay,
		});
	}
	if (breakdown.hours > 0) {
		rows.push({
			ArticleId: articleFor('tim'),
			Text: description,
			Quantity: breakdown.hours,
			UnitPrice: priceHour,
		});
	}
	if (breakdown.extraCost > 0) {
		rows.push({
			ArticleId: articleFor('st'),
			Text: description,
			Quantity: 1,
			UnitPrice: breakdown.extraCost,
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
		const ab = calculateUnitBreakdown(
			assistant.hours ?? 0,
			assistant.days ?? 0,
		);
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
