import { client, ApiError } from '@/lib/client';
import { Equipment } from '@/types/datocms';
import { Item } from '@/lib/client';

export type EquipmentType = Item<Equipment>;

export async function find(id: string): Promise<EquipmentType | null> {
	if (!id) throw new Error('Equipment Id is required');

	const equipment = (
		await client.items.list<Equipment>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'equipment',
				fields: {
					id: { eq: id },
				},
			},
		})
	)?.[0];

	return equipment ?? null;
}

export async function findAll(): Promise<EquipmentType[]> {
	const equipment = await client.items.list<Equipment>({
		page: {
			limit: 500,
		},
		filter: {
			type: 'equipment',
		},
	});
	return equipment;
}
