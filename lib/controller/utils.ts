import { client } from '@/lib/client';
import { ItemTypeDefinition } from '@datocms/cma-client';

export async function getItemTypeIds(models: string[]): Promise<{ [key: string]: string }> {
	const itemTypes = (await client.itemTypes.list()).filter((item) => models.includes(item.api_key));

	return itemTypes.reduce(
		(acc, item) => {
			acc[item.api_key] = item.id;
			return acc;
		},
		{} as { [key: string]: string }
	);
}

export async function findById<T>(id: string, api_key: string): Promise<T | null> {
	const item = (
		await client.items.list({
			page: {
				limit: 1,
			},
			filter: {
				type: api_key,
				fields: {
					id: { eq: id },
				},
			},
		})
	)?.[0];
	return (item as T) ?? null;
}

export async function findWithLinked<T>(id: string, api_key: string): Promise<T | null> {
	const visited = new Set<string>();

	async function processItem(id: string, typeId: string | null, parentId?: string) {
		const record = (
			await client.items.list({
				page: {
					limit: 1,
				},
				nested: true,
				version: 'current',
				filter: {
					type: typeId ?? api_key,
					fields: {
						id: { eq: id },
					},
				},
			})
		)?.[0];

		if (!record) return null;

		parentId && visited.add(parentId);

		const itemTypeId = record.item_type.id;
		const fields = await client.fields.list(itemTypeId);
		const linkFields = fields.filter((f) => f.field_type === 'link' || f.field_type === 'links');

		const ids = new Set<string>();

		for (const f of linkFields) {
			const value = (record as any)[f.api_key];
			if (!value) continue;
			if (Array.isArray(value)) value.forEach((v) => ids.add(v));
			else ids.add(value);
		}

		// Remove ids in visited list
		visited.forEach((i) => ids.delete(i));

		const linkedRecords = ids.size
			? await client.items.list({
					filter: { ids: Array.from(ids).join(',') },
					nested: true,
					version: 'current',
				})
			: [];

		for (const linkField of linkFields) {
			const value = record[linkField.api_key] as any;
			if (!value) continue;

			if (linkField.field_type === 'links') {
				record[linkField.api_key] = await Promise.all(
					value.map((linkId: string) => {
						const linkedRecord = linkedRecords.find((r) => r.id === linkId);
						return linkedRecord ? processItem(linkedRecord.id, linkedRecord.item_type.id, id) : linkId;
					})
				);
			} else {
				const linkedRecord = linkedRecords.find((r) => r.id === value);
				record[linkField.api_key] = linkedRecord
					? await processItem(linkedRecord.id, linkedRecord.item_type.id, id)
					: value;
			}
		}

		return record as T;
	}

	const record = await processItem(id, null);
	return record ?? null;
}
