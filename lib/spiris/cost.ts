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
	days: number;
	hours: number;
	extraCost: number;
};

function convertUnits(totalHours: number, totalDays: number) {
	const extraDaysFromHours = Math.floor(totalHours / 5);
	const remainingHours = totalHours % 5;

	const effectiveDays = totalDays + extraDaysFromHours;

	const months = Math.floor(effectiveDays / 30);
	const remainingDays = effectiveDays % 30;

	return { months, days: remainingDays, hours: remainingHours };
}

export function calculateReportRows(report: ReportLike): UnitBreakdown {
	const rawHours = report.hours ?? 0;
	const rawDays = report.days ?? 0;
	const extraCost = report.extraCost ?? 0;

	let assistantHours = 0;
	let assistantDays = 0;
	for (const assistant of report.assistants ?? []) {
		assistantHours += assistant.hours ?? 0;
		assistantDays += assistant.days ?? 0;
	}

	const { months, days, hours } = convertUnits(
		rawHours + assistantHours,
		rawDays + assistantDays,
	);

	return { months, days, hours, extraCost };
}

export function calculateReportCost(report: ReportLike): number {
	const breakdown = calculateReportRows(report);
	const priceDay = report.workshop.priceDay ?? 0;
	const priceHour = report.workshop.priceHour ?? 0;
	const priceMonth = report.workshop.priceMonth ?? 0;

	return (
		breakdown.months * priceMonth +
		breakdown.days * priceDay +
		breakdown.hours * priceHour +
		breakdown.extraCost
	);
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
	const priceMonth = report.workshop.priceMonth ?? 0;

	const articleFor = (unit: string): string => unitArticles?.[unit] ?? articleId;

	const rows: InvoiceRow[] = [];

	if (breakdown.months > 0) {
		rows.push({
			ArticleId: articleFor('mån'),
			Text: description,
			Quantity: breakdown.months,
			UnitPrice: priceMonth,
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

	return rows;
}
