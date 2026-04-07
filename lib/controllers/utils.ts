import { client } from '@/lib/client';
import { uuid } from '@/lib/schemas/base';
import { SignJWT, jwtVerify } from 'jose';
import { BadRequestError } from '@/lib/errors';
import { ErrorMessages } from '@/lib/error-messages';

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

type DatoItem = Record<string, unknown>;
type ItemCache = Map<string, DatoItem>;

function isUuid(value: unknown): value is string {
	return typeof value === 'string' && uuid.safeParse(value).success;
}

function isLinkField(key: string): boolean {
	return !key.startsWith('_') && key !== 'id';
}

function extractLinkIds(record: DatoItem): string[] {
	const ids: string[] = [];

	for (const [key, value] of Object.entries(record)) {
		if (!isLinkField(key)) continue;

		if (isUuid(value)) {
			ids.push(value);
		} else if (Array.isArray(value)) {
			for (const item of value) {
				if (isUuid(item)) ids.push(item);
			}
		}
	}

	return [...new Set(ids)];
}

function replaceLinksWithRecords(record: DatoItem, linkedRecords: Map<string, DatoItem>): void {
	for (const key of Object.keys(record)) {
		if (!isLinkField(key)) continue;

		const value = record[key];

		if (isUuid(value)) {
			const linked = linkedRecords.get(value);
			if (linked) record[key] = linked;
		} else if (Array.isArray(value)) {
			const resolved = value
				.map((id) => (isUuid(id) ? linkedRecords.get(id) : null))
				.filter((item): item is DatoItem => item !== null);
			if (resolved.length > 0) record[key] = resolved;
		}
	}
}

async function fetchLinkedItems(
	ids: string[],
	visited: Set<string>,
): Promise<Map<string, DatoItem>> {
	const newIds = ids.filter((id) => !visited.has(id));
	if (newIds.length === 0) return new Map();

	const records = await client.items.list({
		filter: { ids: newIds.join(',') },
		nested: true,
		version: 'current',
	});

	const result = new Map<string, DatoItem>();
	for (const record of records) {
		const item = record as DatoItem;
		const recordId = item.id as string;
		result.set(recordId, item);
		visited.add(recordId);
	}

	return result;
}

export async function findWithLinked<T extends DatoItem>(
	id: string,
	maxDepth: number = Infinity,
): Promise<T | null> {
	console.time('link');
	const cache = new Map<string, DatoItem>();
	const visited = new Set<string>();

	async function processRecord(recordId: string, depth: number): Promise<DatoItem | null> {
		if (depth > maxDepth) return null;
		if (visited.has(recordId)) return cache.get(recordId) ?? null;

		const record = await client.items.find(recordId, {
			version: 'current',
			nested: true,
		});

		if (!record) return null;

		const item = record as DatoItem;
		const itemId = item.id as string;
		cache.set(itemId, item);
		visited.add(itemId);

		const linkIds = extractLinkIds(item);
		if (linkIds.length === 0) return item;

		const linkedRecords = await fetchLinkedItems(linkIds, visited);

		for (const [linkedId, linked] of linkedRecords) {
			if (linkedId === itemId) continue;
			cache.set(linkedId, linked);

			if (depth < maxDepth) {
				await processRecord(linkedId, depth + 1);
			}
		}

		replaceLinksWithRecords(item, linkedRecords);
		console.timeEnd('link');
		return item;
	}

	return (await processRecord(id, 0)) as T | null;
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
	if (!title) throw new BadRequestError(ErrorMessages.SLUG_TITLE_REQUIRED);
	if (!key) throw new BadRequestError(ErrorMessages.SLUG_KEY_REQUIRED);
	if (!api_key) throw new BadRequestError(ErrorMessages.SLUG_API_KEY_REQUIRED);

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
