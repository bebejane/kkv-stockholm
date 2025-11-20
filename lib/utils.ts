import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';
import { client } from '@/lib/client';

export function formatDate(date: string): string {
	if (!date) return '';
	return capitalize(format(new Date(date), 'd MMMM yyyy', { locale: sv }));
}

export function formatDateRange(start: string, end: string): string {
	if (!start || !end) return '';
	return `${capitalize(format(new Date(start), 'd MMMM', { locale: sv }))} - ${capitalize(format(new Date(end), 'd MMMM', { locale: sv }))}`;
}

export function formatTimeRange(start: string, end: string): string {
	if (!start || !end) return '';
	return `${format(new Date(start), 'HH:mm', { locale: sv })} - ${format(new Date(end), 'HH:mm', { locale: sv })}`;
}

async function getFieldEnumValues(apiKey: string, fieldApiKey: string): Promise<string[] | null> {
	const itemTypeId = (await client.itemTypes.list()).find((item) => item.api_key === apiKey)?.id;
	const fields = await client.fields.list(itemTypeId as string);
	//@ts-expect-error
	const values = fields.find((field) => field.api_key === fieldApiKey)?.validators?.enum.values;
	return values && Array.isArray(values) ? values : null;
}
