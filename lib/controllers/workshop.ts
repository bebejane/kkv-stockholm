import { client, Item } from '@/lib/client';
import { EquipmentType } from '@/lib/controllers/equipment';
import { findWithLinked } from '@/lib/controllers/utils';
import { Workshop } from '@/types/datocms';

export type WorkshopType = Item<Workshop>;

export type WorkshopTypeLinked = Omit<WorkshopType, 'equipment'> & {
	equipment: (EquipmentType | null)[];
};

export async function findAll(): Promise<WorkshopTypeLinked[]> {
	const ids = (
		await client.items.list<Workshop>({
			page: {
				limit: 500,
			},
			filter: {
				type: 'workshop',
			},
		})
	).map(({ id }) => id);

	const workshopsLinked = await Promise.all(
		ids.map((id) => findWithLinked<WorkshopTypeLinked>(id)),
	);
	return workshopsLinked as WorkshopTypeLinked[];
}
