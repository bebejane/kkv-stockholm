export function calculateReportCost(
	report: AllReportsQuery['allReports'][number] | AllReportsByRangeQuery['allReports'][number],
) {
	const hours = report.hours ?? 0;
	const days = report.days ?? 0;
	const extraCost = report.extraCost ?? 0;
	const priceDay = report.workshop.priceDay ?? 0;
	const priceHour = report.workshop.priceHour ?? 0;

	const memberEffectiveDays = hours >= 5 ? days + 1 : days;
	const memberEffectiveHours = hours >= 5 ? 0 : hours;

	let total = memberEffectiveDays * priceDay + memberEffectiveHours * priceHour + extraCost;
	let assistantsTotal = 0;

	for (const assistant of report.assistants ?? []) {
		const aHours = assistant.hours ?? 0;
		const aDays = assistant.days ?? 0;
		const aEffectiveDays = aHours >= 5 ? aDays + 1 : aDays;
		const aEffectiveHours = aHours >= 5 ? 0 : aHours;
		assistantsTotal += aEffectiveDays * priceDay + aEffectiveHours * priceHour;
	}

	return total + assistantsTotal;
}
