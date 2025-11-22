import { client } from '@/lib/client';
import { uuidSchema } from '@/lib/schemas';
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
		const record = await client.items.find(id);
		if (!record) return null;
		parentId && visited.add(parentId);
		const ids = new Set<string>();

		function isLink(str: string, key: string) {
			return !key.startsWith('_') && key !== 'id' && uuidSchema.safeParse(str).success;
		}

		for (const [key, value] of Object.entries(record)) {
			if (typeof value === 'string' && isLink(value, key)) ids.add(value);
			else if (Array.isArray(value)) {
				value.forEach((v) => {
					if (typeof v === 'string' && isLink(v, key)) {
						ids.add(v);
					}
				});
			}
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

		const promises: { [key: string]: Promise<any> } = {};

		for (const l of linkedRecords) {
			const keys = Object.keys(record);
			const k = keys.find(
				(key) =>
					(typeof record[key] === 'string' && record[key] === l.id) ||
					(Array.isArray(record[key]) && record[key].includes(l.id))
			) as keyof typeof record;
			if (!k) continue;

			if (typeof record[k] === 'string') promises[k] = processItem(l.id, l.item_type.id, id);
			else if (Array.isArray(record[k]))
				promises[k] = Promise.all(record[k].map((id: string) => processItem(id, l.item_type.id, id)));
		}

		for (const key in promises) record[key] = await promises[key];
		return record as T;
	}

	const record = await processItem(id, null);
	return record ?? null;
}

// export async function findWithLinked<T>(id: string, api_key: string): Promise<T | null> {
// 	const visited = new Set<string>();
// 	let count = 0;
// 	async function processItem(id: string, typeId: string | null, parentId?: string) {
// 		const record = await client.items.find(id);
// 		if (!record) return null;

// 		parentId && visited.add(parentId);

// 		const itemTypeId = record.item_type.id;
// 		const fields = await client.fields.list(itemTypeId);
// 		const linkFields = fields.filter((f) => f.field_type === 'link' || f.field_type === 'links');

// 		const ids = new Set<string>();

// 		for (const f of linkFields) {
// 			const value = (record as any)[f.api_key];
// 			if (!value) continue;
// 			if (Array.isArray(value)) value.forEach((v) => ids.add(v));
// 			else ids.add(value);
// 		}

// 		// Remove ids in visited list
// 		visited.forEach((i) => ids.delete(i));

// 		const linkedRecords = ids.size
// 			? await client.items.list({
// 					filter: { ids: Array.from(ids).join(',') },
// 					nested: true,
// 					version: 'current',
// 				})
// 			: [];

// 		for (const linkField of linkFields) {
// 			const value = record[linkField.api_key] as any;
// 			if (!value) continue;

// 			if (linkField.field_type === 'links') {
// 				record[linkField.api_key] = await Promise.all(
// 					value.map((linkId: string) => {
// 						const linkedRecord = linkedRecords.find((r) => r.id === linkId);
// 						return linkedRecord ? processItem(linkedRecord.id, linkedRecord.item_type.id, id) : linkId;
// 					})
// 				);
// 			} else {
// 				const linkedRecord = linkedRecords.find((r) => r.id === value);
// 				record[linkField.api_key] = linkedRecord
// 					? await processItem(linkedRecord.id, linkedRecord.item_type.id, id)
// 					: value;
// 			}
// 		}

// 		return record as T;
// 	}

// 	const record = await processItem(id, null);
// 	console.log('count', count);
// 	return record ?? null;
// }
