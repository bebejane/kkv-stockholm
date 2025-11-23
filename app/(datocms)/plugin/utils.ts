import { Member } from '@/types/datocms';
import { Client } from '@datocms/cma-client';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';

let cache: { [key: string]: any } = {};
let cacheLife = 1000 * 60 * 5;

export async function cached(id: string, fn: Promise<any>): Promise<any> {
	if (cache[id] && new Date().getTime() - cache[id].t < cacheLife) return cache[id].r;
	const res = await fn;
	cache[id] = {
		t: new Date().getTime(),
		r: res,
	};
	return res;
}

export const getMember = async (id: string, client: Client): Promise<Item<Member> | null> => {
	return new Promise((resolve, reject) => {
		cached(
			id,
			client.items
				.list<Member>({
					page: {
						limit: 1,
					},
					filter: {
						type: 'member',
						id: id,
					},
				})
				.then((res) => {
					resolve(res[0] ?? null);
				})
				.catch((err) => {
					reject(err);
				})
		);
	});
};
