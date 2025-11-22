import { client, ApiError, buildBlockRecord } from '@/lib/client';
import { Item } from '@/lib/client';
import { Assistant, Report } from '@/types/datocms';
import { findWithLinked, getItemTypeIds } from './utils';
import { ZodError } from 'zod/v4';
import { reportCreateSchema, reportUpdateSchema } from '@/lib/schemas';
import { MemberType } from '@/lib/controller/member';
import { BookingTypeLinked } from '@/lib/controller/booking';
import { WorkshopTypeLinked } from '@/lib/controller/workshop';

export type ReportType = Item<Report>;
export type ReportTypeLinked = Omit<ReportType, 'member' | 'booking' | 'workshop'> & {
	member: MemberType[];
	booking: BookingTypeLinked;
	workshop: WorkshopTypeLinked;
};

export async function create(data: Partial<ReportType>): Promise<ReportType> {
	try {
		if (data.id) return await update(data.id, data);

		const newReportData = reportCreateSchema.parse(data);
		const { report: reportTypeId, assistant: assistantTypeId } = await getItemTypeIds(['report', 'assistant']);

		const report = await client.items.create<Report>({
			item_type: {
				id: reportTypeId as Report['itemTypeId'],
				type: 'item_type',
			},
			...newReportData,
			assistants: newReportData.assistants?.map((a) =>
				buildBlockRecord<Assistant>({
					item_type: { type: 'item_type', id: assistantTypeId as Assistant['itemTypeId'] },
					...a,
				})
			),
		});
		//await sendReportCreatedEmail({ to: session.user.email as string, name: session.user.name as string, report });
		return report;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		console.log(JSON.stringify(e, null, 2));
		throw e;
	}
}

export async function update(id: string, data: Partial<ReportType>): Promise<ReportType> {
	if (!id) throw new Error('Report Id is required');
	if (!data) throw new Error('Report data is required');

	try {
		const { assistant: assistantTypeId } = await getItemTypeIds(['report', 'assistant']);
		const updatedReportData = reportUpdateSchema.parse(data);
		const report = await client.items.update<Report>(id, {
			...updatedReportData,
			assistants: updatedReportData.assistants?.map((a) =>
				buildBlockRecord<Assistant>({
					item_type: { type: 'item_type', id: assistantTypeId as Assistant['itemTypeId'] },
					...a,
				})
			),
		});

		return report;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		throw e;
	}
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new Error('Report Id is required');
	try {
		await client.items.destroy(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export async function find(id: string): Promise<ReportTypeLinked | null> {
	if (!id) return null;
	const report = await findWithLinked<ReportTypeLinked>(id, 'report');
	return report;
}

export async function findByBookingId(bookingId: string): Promise<ReportTypeLinked | null> {
	console.log('findByBookingId', bookingId);
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

	return Promise.all(reports.map(({ id }) => findWithLinked<ReportTypeLinked>(id, 'report'))) as Promise<
		ReportTypeLinked[]
	>;
}
