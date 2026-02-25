import { client } from '@/lib/client';
import { uuid } from '@/lib/schemas/base';
import { SignJWT, jwtVerify } from 'jose';

export async function getItemTypeIds(models: string[]): Promise<{ [key: string]: string }> {
	const itemTypes = (await client.itemTypes.list()).filter((item) => models.includes(item.api_key));

	return itemTypes.reduce(
		(acc, item) => {
			acc[item.api_key] = item.id;
			return acc;
		},
		{} as { [key: string]: string },
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

export async function findWithLinked<T>(
	id: string,
	maxDepth: number = Infinity,
): Promise<T | null> {
	const visited: string[] = [];

	let count = 0;

	function isLink(str: string, key: string) {
		const link = str && !key.startsWith('_') && key !== 'id' && uuid.safeParse(str).success;
		//console.log(str, key, link);
		return link;
	}

	async function processItem(
		id: string,
		parentId: string | undefined,
		depth: number,
		record?: any,
	) {
		if (maxDepth !== Infinity && !isNaN(maxDepth) && depth > maxDepth) return null;

		record = record ?? (await client.items.find(id, { version: 'current', nested: true }));
		if (!record) return null;

		parentId && visited.push(parentId);

		const ids: string[] = [];

		for (const [key, value] of Object.entries(record)) {
			if (isLink(value as string, key)) ids.push(value as string);
			else if (Array.isArray(value)) {
				value.forEach((v) => {
					if (isLink(v, key)) {
						ids.push(v);
					}
				});
			}
		}

		//Remove ids in visited list
		visited.forEach((i) =>
			ids.splice(
				ids.findIndex((i2) => i === i2),
				1,
			),
		);
		ids.length === 0 && count++;
		const itemIds = ids.filter((item, index) => ids.indexOf(item) === index);
		const linkedRecords = itemIds.length
			? await client.items.list({
					filter: { ids: itemIds.join(',') },
					nested: true,
					version: 'current',
				})
			: [];

		const records = [];

		for (const l of linkedRecords) {
			const keys = Object.keys(record);
			const k = keys.find(
				(key) =>
					(typeof record[key] === 'string' && record[key] === l.id) ||
					(Array.isArray(record[key]) && record[key].includes(l.id)),
			) as keyof typeof record;
			if (!k) continue;

			if (typeof record[k] === 'string') {
				records.push(l);
			} else if (Array.isArray(record[k])) {
				records.push(
					...(linkedRecords.filter((l) => (record[k] as string[])?.includes(l.id)) ?? []),
				);
			}
		}

		const res: any[] = await Promise.all(records.map((l) => processItem(l.id, id, depth + 1, l)));

		for (const k in record) {
			if (Array.isArray(record[k]) && !record[k].some((id: string) => !isLink(id, k)))
				record[k] = res.filter((r) => (record[k] as string[]).find((id) => r && id === r?.id));

			if (typeof record[k] === 'string' && isLink(record[k], k))
				record[k] = res.find((r) => r?.id === record[k]);
		}

		return record as T;
	}

	const record = await processItem(id, undefined, 0);
	return record ?? null;
}

export async function generateVerificationToken(email: string): Promise<string> {
	const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);
	return await new SignJWT({ email })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1y')
		.sign(secret);
}

export async function verifyVerificationToken(token: string): Promise<{ email: string }> {
	const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);
	const { payload } = await jwtVerify(token, secret);
	return { email: payload.email as string };
}

export async function generateSlug(title: string, key: string, api_key: string): Promise<string> {
	if (!title) throw new Error('Slug string title is required');
	if (!key) throw new Error('Slug key is required');
	if (!api_key) throw new Error('Slug api_key is required');

	const slugify = (s: string) => {
		return s
			.toString()
			.normalize('NFKD')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^\w\-]+/g, '')
			.replace(/\_/g, '-')
			.replace(/\-\-+/g, '-')
			.replace(/\-$/g, '');
	};

	let slug = slugify(title);

	const slugs: string[] = [];
	for await (const record of client.items.listPagedIterator({
		version: 'current',
		filtter: { type: api_key },
	}))
		record[key] && slugs.push(record[key] as string);

	if (!slugs.includes(slug)) return slug;

	const slugNo = slugs.filter((s) => s.substring(0, s.lastIndexOf('-')) === slug).length;
	return `${slug}-${slugNo}`;
}
