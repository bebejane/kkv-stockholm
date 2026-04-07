import { client, ApiError } from '@/lib/client';
import { Equipment } from '@/types/datocms';
import { Item } from '@/lib/client';
import { BadRequestError } from '@/lib/errors';
import { ErrorMessages } from '@/lib/error-messages';

export type EquipmentType = Item<Equipment>;

export async function find(id: string): Promise<EquipmentType | null> {
	if (!id) throw new BadRequestError(ErrorMessages.EQUIPMENT_ID_REQUIRED);

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
