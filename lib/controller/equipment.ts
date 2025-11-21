import { client, ApiError } from '@/lib/client';
import { Equipment } from '@/types/schema';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';

export async function getAllEquipment(): Promise<Item<Equipment>[]> {
	try {
		const equipment = await client.items.list<Equipment>({
			page: {
				limit: 500,
			},
			filter: {
				type: 'equipment',
			},
		});
		return equipment;
	} catch (e) {
		if (e instanceof ApiError) throw new Error(e.message);
		throw e;
	}
}
