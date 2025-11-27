import { client, buildBlockRecord } from '@/lib/client';
import { Item } from '@/lib/client';
import { Assistant, Report } from '@/types/datocms';
import { findWithLinked, getItemTypeIds } from './utils';
import { ZodError } from 'zod/v4';
import { reportCreateSchema, reportUpdateSchema } from '@/lib/schemas/report';
import { MemberType } from '@/lib/controllers/member';
import { BookingTypeLinked } from '@/lib/controllers/booking';
import { WorkshopTypeLinked } from '@/lib/controllers/workshop';

export type AssistantType = Pick<Item<Assistant>, 'hours' | 'days'> & { id?: string };
export type ReportType = Item<Report>;
export type ReportTypeLinked = Omit<ReportType, 'member' | 'booking' | 'workshop' | 'assistants'> & {
	member: MemberType;
	booking: BookingTypeLinked;
	workshop: WorkshopTypeLinked;
	assistants: AssistantType[];
};

export async function create(data: Partial<ReportType>): Promise<ReportType> {
	if (data.id) return await update(data.id, data);

	const newReportData = reportCreateSchema.parse(data);
	const { report: reportTypeId, assistant: assistantTypeId } = await getItemTypeIds(['report', 'assistant', 'booking']);

	const report = await client.items.create<Report>({
		item_type: {
			id: reportTypeId as Report['itemTypeId'],
			type: 'item_type',
		},
		...newReportData,
		booking: newReportData.booking || null,
		assistants: newReportData.assistants?.map((a) =>
			buildBlockRecord<Assistant>({
				item_type: { type: 'item_type', id: assistantTypeId as Assistant['itemTypeId'] },
				...a,
			})
		),
	});

	if (newReportData.booking) await linkReportToBooking(report.id, newReportData.booking);

	return report;
}

export async function update(id: string, data: Partial<ReportType>): Promise<ReportType> {
	if (!id) throw new Error('Report Id is required');
	if (!data) throw new Error('Report data is required');

	const { assistant: assistantTypeId } = await getItemTypeIds(['report', 'assistant']);
	const updatedReportData = reportUpdateSchema.parse(data);
	const report = await client.items.update<Report>(id, {
		...updatedReportData,
		booking: updatedReportData.booking || null,
		assistants: updatedReportData.assistants?.map((a) =>
			buildBlockRecord<Assistant>({
				item_type: { type: 'item_type', id: assistantTypeId as Assistant['itemTypeId'] },
				...a,
			})
		),
	});

	if (updatedReportData.booking) await linkReportToBooking(report.id, updatedReportData.booking);

	return report;
}

export async function linkReportToBooking(reportId: string, bookingId: string): Promise<void> {
	if (!bookingId) throw new Error('Booking Id is required');
	if (!reportId) throw new Error('Report Id is required');

	await client.items.update(bookingId, { report: reportId });
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new Error('Report Id is required');
	await client.items.destroy(id);
}

export async function find(id: string): Promise<ReportTypeLinked | null> {
	if (!id) return null;
	const report = await findWithLinked<ReportTypeLinked>(id);
	return report;
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
				booking: { eq: bookingId },
			},
		})
	)?.[0];

	if (!report) return null;
	return find(report.id);
}

export async function findByMember(memberId: string): Promise<ReportTypeLinked[]> {
	const reports = await client.items.list<Report>({
		page: {
			limit: 500,
		},
		filter: {
			type: 'report',
			member: { eq: memberId },
		},
	});

	return Promise.all(reports.map(({ id }) => findWithLinked<ReportTypeLinked>(id))) as Promise<ReportTypeLinked[]>;
}
