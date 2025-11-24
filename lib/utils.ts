import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';
import { client } from '@/lib/client';
import { DateTimeFieldValue } from '@datocms/cma-client';

export function formatDate(date: string | DateTimeFieldValue): string {
	if (!date) return '';
	return capitalize(format(new Date(date), 'd MMMM yyyy', { locale: sv }));
}

export function formatDateRange(
	start: string | DateTimeFieldValue,
	end: string | DateTimeFieldValue,
	opt?: { short: boolean }
): string {
	if (!start || !end) return '';
	const f = opt?.short ? 'd MMM' : 'd MMMM';
	return `${capitalize(format(new Date(start), f, { locale: sv }))} - ${capitalize(format(new Date(end), f, { locale: sv }))}`.replaceAll(
		'.',
		''
	);
}

export function formatTimeRange(start: string | DateTimeFieldValue, end: string | DateTimeFieldValue): string {
	if (!start || !end) return '';
	return `${format(new Date(start), 'HH:mm', { locale: sv })} - ${format(new Date(end), 'HH:mm', { locale: sv })}`;
}

export function formatPrice(price: number | null): string {
	if (!price) return '';
	const nf = new Intl.NumberFormat(`se-SV`);
	return `${nf.format(price)} kr`;
}
