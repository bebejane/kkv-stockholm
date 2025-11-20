import { client, ApiError } from '@/lib/client';
import { Workshop } from '@/types/schema';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';

export async function getAllWorkshops(): Promise<Item<Workshop>[]> {
	try {
		const workshops = await client.items.list<Workshop>({
			page: {
				limit: 100,
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
