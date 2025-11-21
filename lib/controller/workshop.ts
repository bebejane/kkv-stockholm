import { client, ApiError } from '@/lib/client';
import { Workshop, Equipment } from '@/types/schema';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';

export type WorkshopWithEquipment = Item<Workshop> & {
	equipment: Item<Equipment>[];
	settings: unknown;
	itemTypeId: string;
	fields: Record<string, unknown>;
};

export async function getAllWorkshops(): Promise<Item<Workshop>[]> {
	try {
		const workshops = await client.items.list<Workshop>({
			page: {
				limit: 500,
			},
			filter: {
				type: 'workshop',
			},
		});
		return workshops;
	} catch (e) {
		if (e instanceof ApiError) throw new Error(e.message);
		throw e;
	}
}

export async function getAllWorkshopsWithEquipment(): Promise<Item<Workshop>[]> {
	try {
		const [workshops, equipment] = await Promise.all([
			client.items.list<Workshop>({
				page: {
					limit: 500,
				},
				filter: {
					type: 'workshop',
				},
			}),
			client.items.list<Equipment>({
				page: {
					limit: 500,
				},
				filter: {
					type: 'equipment',
				},
			}),
		]);
		return workshops.map((workshop) => ({
			...workshop,
			equipment: workshop.equipment.map((equipmentId) => equipment.find(({ id }) => id === equipmentId)),
		})) as WorkshopWithEquipment[];
	} catch (e) {
		if (e instanceof ApiError) throw new Error(e.message);
		throw e;
	}
}
