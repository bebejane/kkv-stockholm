import { client, buildBlockRecord } from '@/lib/client';
import { Item } from '@/lib/client';
import { Assistant, Report } from '@/types/datocms';
import { findById, findWithLinked, getItemTypeIds, linkId } from './utils';
import { reportCreateSchema, reportUpdateSchema } from '@/lib/schemas/report';
import { z } from '@/lib/schemas/base';
import { MemberType } from '@/lib/controllers/member';
import { find as findBooking, BookingTypeLinked } from '@/lib/controllers/booking';
import { getMemberSession } from '@/auth/utils';
import { WorkshopTypeLinked } from '@/lib/controllers/workshop';
import { tzDate } from '@/lib/dates';
import { getBookingDuration } from '@/lib/booking-duration';
import { differenceInDays, endOfMonth, format, startOfMonth } from 'date-fns';
import xlsx from 'node-xlsx';
import { AllReportsByRangeDocument, BookingsForAutoReportDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { buildInvoiceLines, InvoiceLine } from '@/lib/spiris/cost';
import { BadRequestError, NotFoundError, ForbiddenError } from '@/lib/errors';
import { ErrorMessages } from '@/lib/error-messages';

export type AssistantType = Pick<Item<Assistant>, 'hours' | 'days'> & { id?: string };
export type ReportType = Item<Report>;
export type ReportTypeLinked = Omit<
	ReportType,
	'member' | 'booking' | 'workshop' | 'assistants'
> & {
	member: MemberType;
	booking: BookingTypeLinked;
	workshop: WorkshopTypeLinked;
	assistants: AssistantType[];
};

type ReportCreateData = z.infer<typeof reportCreateSchema>;
type ReportTypeIds = { report: string; assistant: string };

async function reportTypeIds(): Promise<ReportTypeIds> {
	const { report, assistant } = await getItemTypeIds(['report', 'assistant', 'booking']);
	return { report: report as string, assistant: assistant as string };
}

/**
 * Light existence check (single CMA call) used by the auto-report cron so a
 * run that crashed after creating a report — or a stale CDA read — cannot
 * produce duplicates.
 */
async function findReportIdByBookingId(bookingId: string): Promise<string | null> {
	const reports = await client.items.list<Report>({
		page: { limit: 1 },
		filter: {
			type: 'report',
			fields: {
				booking: { eq: bookingId },
			},
		},
	});
	return reports[0]?.id ?? null;
}

async function insertReport(
	newReportData: ReportCreateData,
	typeIds: ReportTypeIds,
): Promise<ReportType> {
	const report = await client.items.create<Report>({
		item_type: {
			id: typeIds.report as Report['itemTypeId'],
			type: 'item_type',
		},
		...newReportData,
		booking: newReportData.booking || null,
		days: typeof newReportData.days === 'number' ? newReportData.days : undefined,
		hours: typeof newReportData.hours === 'number' ? newReportData.hours : undefined,
		assistants: newReportData.assistants?.map((a) =>
			buildBlockRecord<Assistant>({
				item_type: { type: 'item_type', id: typeIds.assistant as Assistant['itemTypeId'] },
				...a,
				days: typeof a.days === 'number' ? a.days : undefined,
				hours: typeof a.hours === 'number' ? a.hours : undefined,
			}),
		),
	});

	if (newReportData.booking) await linkReportToBooking(report.id, newReportData.booking);

	return report;
}

export async function create(data: Partial<ReportType>): Promise<ReportType> {
	const { member } = await getMemberSession();

	const newReportData = reportCreateSchema.parse({
		...data,
		member: member.id,
	});

	if (newReportData.booking) {
		const booking = await findBooking(newReportData.booking);
		if (!booking || linkId(booking.member) !== member.id)
			throw new ForbiddenError(ErrorMessages.FORBIDDEN);
	}

	return insertReport(newReportData, await reportTypeIds());
}

export type AutoReportResult = {
	bookingId: string;
	reportId?: string;
	error?: string;
};

export type AutoReportsSummary = {
	month: string;
	created: number;
	skipped: number;
	failed: number;
	results: AutoReportResult[];
};

/**
 * Creates reports for all bookings that ended in the month of `date`, are not
 * aborted and have no report yet, using the booking's duration.
 */
export async function createAutoReportsForMonth(date: Date): Promise<AutoReportsSummary> {
	const start = startOfMonth(tzDate(date));
	const end = endOfMonth(tzDate(date));

	const { allBookings } = await apiQuery(BookingsForAutoReportDocument, {
		all: true,
		revalidate: 0,
		variables: { start: start.toISOString(), end: end.toISOString() },
	});

	const typeIds = await reportTypeIds();
	const results: AutoReportResult[] = [];
	let skipped = 0;

	for (const booking of allBookings) {
		const { days, hours } = getBookingDuration(booking.start, booking.end);

		if (!days && !hours) {
			skipped++;
			continue;
		}

		const existingId = await findReportIdByBookingId(booking.id);
		if (existingId) {
			try {
				await linkReportToBooking(existingId, booking.id);
			} catch {
				// the report exists; repairing the booking link is best-effort
			}
			skipped++;
			continue;
		}

		try {
			const newReportData = reportCreateSchema.parse({
				member: booking.member.id,
				booking: booking.id,
				workshop: booking.workshop.id,
				date: booking.end,
				hours,
				days,
				extra_cost: '',
			});

			const report = await insertReport(newReportData, typeIds);
			results.push({ bookingId: booking.id, reportId: report.id });
		} catch (e) {
			results.push({
				bookingId: booking.id,
				error: e instanceof Error ? e.message : 'Unknown error',
			});
		}
	}

	const failed = results.filter((result) => result.error).length;

	return {
		month: format(tzDate(date), 'yyyy-MM'),
		created: results.length - failed,
		skipped,
		failed,
		results,
	};
}

export async function update(id: string, data: Partial<ReportType>): Promise<ReportType> {
	if (!id) throw new BadRequestError(ErrorMessages.REPORT_ID_REQUIRED);
	if (!data) throw new BadRequestError(ErrorMessages.REPORT_DATA_REQUIRED);

	const prevReport = await find(id);

	if (prevReport && differenceInDays(tzDate(new Date()), tzDate(prevReport.meta.created_at)) > 0)
		throw new BadRequestError(ErrorMessages.REPORT_LOCKED);

	const { assistant: assistantTypeId } = await getItemTypeIds(['report', 'assistant']);
	const updatedReportData = reportUpdateSchema.parse(data);
	const report = await client.items.update<Report>(id, {
		...updatedReportData,
		booking: updatedReportData.booking || null,
		days: typeof updatedReportData.days === 'number' ? updatedReportData.days : undefined,
		hours: typeof updatedReportData.hours === 'number' ? updatedReportData.hours : undefined,
		assistants: updatedReportData.assistants?.map((a) =>
			buildBlockRecord<Assistant>({
				item_type: { type: 'item_type', id: assistantTypeId as Assistant['itemTypeId'] },
				...a,
				days: typeof a.days === 'number' ? a.days : undefined,
				hours: typeof a.hours === 'number' ? a.hours : undefined,
			}),
		),
	});

	if (updatedReportData.booking) await linkReportToBooking(report.id, updatedReportData.booking);

	return report;
}

export async function linkReportToBooking(reportId: string, bookingId: string): Promise<void> {
	if (!bookingId) throw new BadRequestError(ErrorMessages.BOOKING_ID_REQUIRED);
	if (!reportId) throw new BadRequestError(ErrorMessages.REPORT_ID_REQUIRED);

	await client.items.update(bookingId, { report: reportId });
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new BadRequestError(ErrorMessages.REPORT_ID_REQUIRED);
	await client.items.destroy(id);
}

export async function find(id: string): Promise<ReportTypeLinked | null> {
	if (!id) return null;
	// Type-filtered so records of other models can't be read/edited/deleted
	// through the report routes.
	if (!(await findById<ReportType>(id, 'report'))) return null;

	const report = await findWithLinked<ReportTypeLinked>(id, 2);
	if (!report) return null;

	return {
		...report,
		assistants: report.assistants.map((a: any) => ({
			id,
			...a.attributes,
		})),
	};
}

export async function findByBookingId(bookingId: string): Promise<ReportTypeLinked | null> {
	if (!bookingId) return null;

	const report = (
		await client.items.list<Report>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'report',
				fields: {
					booking: { eq: bookingId },
				},
			},
		})
	)?.[0];

	if (!report) return null;
	return find(report.id);
}

export async function findByMember(memberId: string): Promise<ReportTypeLinked[]> {
	const ids: string[] = [];
	for await (const report of client.items.listPagedIterator<Report>({
		filter: {
			type: 'report',
			fields: {
				member: { eq: memberId },
			},
		},
	})) {
		ids.push(report.id);
	}

	return Promise.all(ids.map((id) => findWithLinked<ReportTypeLinked>(id))) as Promise<
		ReportTypeLinked[]
	>;
}
export async function findByRange(
	start: Date,
	end: Date,
): Promise<AllReportsByRangeQuery['allReports']> {
	const { allReports, _allReportsMeta } = await apiQuery(AllReportsByRangeDocument, {
		all: true,
		variables: {
			start: start.toISOString(),
			end: end.toISOString(),
		},
	});
	if (allReports.length !== _allReportsMeta.count)
		console.warn(
			`report.findByRange: fetched ${allReports.length} of ${_allReportsMeta.count} reports`,
		);
	return allReports;
}

export type MonthCostGroup = {
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

export type MonthCostBreakdown = {
	memberId: string;
	month: string;
	groups: MonthCostGroup[];
	total: number;
};

export function buildMonthCostBreakdown(
	memberId: string,
	date: Date,
	reports: AllReportsByRangeQuery['allReports'],
): MonthCostBreakdown {
	const titles = new Map<string, string>();
	for (const report of reports) {
		const workshopId = report.workshop.id;
		if (!titles.has(workshopId)) {
			titles.set(
				workshopId,
				report.booking?.workshop?.title ??
					report.workshop.title ??
					report.workshop.titleLong ??
					'Workshop',
			);
		}
	}

	const groups = new Map<string, MonthCostGroup>();
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

	const list = Array.from(groups.values());

	return {
		memberId,
		month: format(tzDate(date), 'yyyy-MM'),
		groups: list,
		total: list.reduce((sum, group) => sum + group.total, 0),
	};
}

/**
 * Calculates the invoice breakdown for a member's reports in the month of
 * `date`. Reports for the same workshop are combined, the member's own time is
 * converted once, assistants and extra costs stay per report, and each
 * workshop group is capped at its month price.
 */
export async function calculateReportCostByMonth(
	memberId: string,
	date: Date,
): Promise<MonthCostBreakdown> {
	const start = startOfMonth(tzDate(date));
	const end = endOfMonth(tzDate(date));
	const reports = (await findByRange(start, end)).filter(
		(report) => report.member?.id === memberId,
	);

	return buildMonthCostBreakdown(memberId, date, reports);
}

export async function generateMonthReport(date: Date): Promise<Buffer> {
	const start = startOfMonth(tzDate(date));
	const end = endOfMonth(tzDate(date));
	const reports = await findByRange(start, end);

	const byMember = new Map<string, AllReportsByRangeQuery['allReports']>();
	for (const report of reports) {
		const memberId = report.member.id;
		const memberReports = byMember.get(memberId);
		if (memberReports) memberReports.push(report);
		else byMember.set(memberId, [report]);
	}

	const header = ['E-post', 'Verkstad', 'Timmar', 'Dagar', 'Extra', 'Totalt'];
	const rows: (string | number)[][] = [];

	for (const [memberId, memberReports] of byMember) {
		const email = memberReports[0].member.email;

		const reported = new Map<string, { hours: number; days: number; extra: number }>();
		for (const report of memberReports) {
			const workshopId = report.workshop.id;
			const raw = reported.get(workshopId) ?? { hours: 0, days: 0, extra: 0 };
			raw.hours += report.hours ?? 0;
			raw.days += report.days ?? 0;
			raw.extra += report.extraCost ?? 0;
			reported.set(workshopId, raw);
		}

		const breakdown = buildMonthCostBreakdown(memberId, date, memberReports);
		for (const group of breakdown.groups) {
			const raw = reported.get(group.workshopId) ?? { hours: 0, days: 0, extra: 0 };
			rows.push([email, group.title, raw.hours, raw.days, raw.extra, group.total]);
		}
	}

	const data = [header, ...rows.sort((a, b) => String(a[0]).localeCompare(String(b[0])))];
	const buffer = xlsx.build([{ name: 'mySheetName', data, options: {} }]);
	return buffer;
}
