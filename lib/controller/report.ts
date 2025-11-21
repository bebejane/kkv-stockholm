import { client, ApiError, buildBlockRecord } from '@/lib/client';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { Assistant, Report } from '@/types/datocms';
import { getItemTypeIds } from './utils';
//import { sendReportCreatedEmail } from '@/lib/emails';
import { ZodError, z } from 'zod/v4';
import { reportSchema, reportCreateSchema, reportUpdateSchema } from '@/lib/schemas';
import { getSession } from '@/auth/utils';

export async function createReport(memberId: string, data: Partial<Item<Report>>): Promise<Item<Report>> {
	try {
		if (data.id) return await updateReport(data.id, data);

		const newReportData = reportSchema.parse({ member: memberId, ...data });
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

export async function updateReport(id: string, data: Partial<Item<Report>>): Promise<Item<Report>> {
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

export async function cancelReport(id: string): Promise<void> {
	if (!id) throw new Error('Report Id is required');
	try {
		const session = await getSession();
		const report = await getReport(id);
		if (!report) throw new Error('Report not found');
		await removeReport(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}
export async function removeReport(id: string): Promise<void> {
	if (!id) throw new Error('Report Id is required');
	try {
		const session = await getSession();
		await client.items.destroy(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export async function getReport(id: string): Promise<Item<Report> | null> {
	if (!id) return null;
	const session = await getSession();
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
