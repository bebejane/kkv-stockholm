import { client, ApiError, buildBlockRecord } from '@/lib/client';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { Assistant, Report } from '@/types/datocms';
import { getItemTypeIds } from './utils';
import { ZodError, z } from 'zod/v4';
import { reportSchema, reportCreateSchema, reportUpdateSchema } from '@/lib/schemas';
import { getUserSession } from '@/auth/utils';
import { getItemWithLinked } from 'next-dato-utils/config';

export type ReportType = Item<Report>;

export async function create(data: Partial<ReportType>): Promise<ReportType> {
	try {
		if (data.id) return await update(data.id, data);

		const newReportData = reportSchema.parse(data);
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
		const session = await getUserSession();
		await client.items.destroy(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export async function find(id: string): Promise<ReportType | null> {
	if (!id) return null;
	//const report = getItemWithLinked(id);

	const report = (
		await client.items.list<Report>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'report',
				fields: {
					id: { eq: id },
				},
			},
		})
	)?.[0];

	return report ?? null;
}
