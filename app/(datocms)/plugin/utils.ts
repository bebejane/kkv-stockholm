import { Client } from '@datocms/cma-client';

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

export const getItemCached = async <T>(id: string, client: Client): Promise<T | null> => {
	console.log(id);
	return new Promise((resolve, reject) => {
		cached(
			id,
			client.items
				.find(id)
				.then((res) => resolve((res as T) ?? null))
				.catch(reject)
		);
	});
};
