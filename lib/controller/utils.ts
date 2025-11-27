import { client } from '@/lib/client';
import { uuidSchema } from '@/lib/schemas';
import { SignJWT, jwtVerify } from 'jose';

export async function getItemTypeIds(models: string[]): Promise<{ [key: string]: string }> {
	const itemTypes = (await client.itemTypes.list()).filter((item) => models.includes(item.api_key));

	return itemTypes.reduce(
		(acc, item) => {
			acc[item.api_key] = item.id;
			return acc;
		},
		{} as { [key: string]: string }
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

export async function findWithLinked<T>(id: string, maxDepth: number = Infinity): Promise<T | null> {
	const visited = new Set<string>();

	async function processItem(id: string, typeId: string | null, parentId: string | undefined, depth: number) {
		if (maxDepth !== Infinity && !isNaN(maxDepth) && depth > maxDepth) return null;

		const record = await client.items.find(id);
		if (!record) return null;

		parentId && visited.add(parentId);
		const ids = new Set<string>();

		function isLink(str: string, key: string) {
			return !key.startsWith('_') && key !== 'id' && uuidSchema.safeParse(str).success;
		}

		for (const [key, value] of Object.entries(record)) {
			if (typeof value === 'string' && isLink(value, key)) ids.add(value);
			else if (Array.isArray(value)) {
				value.forEach((v) => {
					if (typeof v === 'string' && isLink(v, key)) {
						ids.add(v);
					}
				});
			}
		}

		// Remove ids in visited list
		visited.forEach((i) => ids.delete(i));

		const linkedRecords = ids.size
			? await client.items.list({
					filter: { ids: Array.from(ids).join(',') },
					nested: true,
					version: 'current',
				})
			: [];

		const promises: { [key: string]: Promise<any> } = {};

		for (const l of linkedRecords) {
			const keys = Object.keys(record);
			const k = keys.find(
				(key) =>
					(typeof record[key] === 'string' && record[key] === l.id) ||
					(Array.isArray(record[key]) && record[key].includes(l.id))
			) as keyof typeof record;
			if (!k) continue;

			if (typeof record[k] === 'string') promises[k] = processItem(l.id, l.item_type.id, id, depth + 1);
			else if (Array.isArray(record[k]))
				promises[k] = Promise.all(record[k].map((id: string) => processItem(id, l.item_type.id, id, depth + 1)));
		}

		for (const key in promises) record[key] = await promises[key];
		return record as T;
	}

	const record = await processItem(id, null, undefined, 0);
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
	for await (const record of client.items.listPagedIterator({ version: 'current', filtter: { type: api_key } }))
		record[key] && slugs.push(record[key] as string);

	if (!slugs.includes(slug)) return slug;

	const slugNo = slugs.filter((s) => s.substring(0, s.lastIndexOf('-')) === slug).length;
	return `${slug}-${slugNo}`;
}
