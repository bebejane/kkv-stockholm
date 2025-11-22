import { client, ApiError } from '@/lib/client';
import { Workshop, Equipment } from '@/types/datocms';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';

export type WorkshopType = Item<Workshop>;

export type WorkshopWithEquipment = WorkshopType & {
	equipment: Item<Equipment>[];
	settings: unknown;
	itemTypeId: string;
	fields: Record<string, unknown>;
};

export async function findAll(): Promise<WorkshopType[]> {
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

export async function findAllWithEquipment(): Promise<WorkshopType[]> {
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
