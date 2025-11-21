import 'dotenv/config';
import { client } from '@/lib/client';
import { apiQuery } from 'next-dato-utils/api';
import { Member } from '@/types/datocms';
import child_process from 'node:child_process';

async function getFieldEnumValues(apiKey: string, fieldApiKey: string): Promise<string[] | null> {
	const itemTypeId = (await client.itemTypes.list()).find((item) => item.api_key === apiKey)?.id;
	const fields = await client.fields.list(itemTypeId as string);
	//@ts-expect-error
	const values = fields.find((field) => field.api_key === fieldApiKey)?.validators?.enum.values;
	return values && Array.isArray(values) ? values : null;
}

export async function test() {}

test();
