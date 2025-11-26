import { formatInTimeZone } from 'date-fns-tz';
import { sv } from 'date-fns/locale';
import { TZ } from './constants';
import { capitalize } from 'next-dato-utils/utils';
import { DateTimeFieldValue } from '@datocms/cma-client';

export type DateType = string | Date | DateTimeFieldValue;

export function formatDateInput(date: DateType): string {
	if (!date) return '';
	return capitalize(formatInTimeZone(new Date(date), TZ, 'yyyy-MM-dd', { locale: sv }));
}

export function formatDate(date: DateType): string {
	if (!date) return '';
	return capitalize(formatInTimeZone(new Date(date), TZ, 'd MMMM yyyy', { locale: sv }));
}

export function formatDateRange(start: DateType, end: DateType, opt?: { short: boolean }): string {
	if (!start || !end) return '';
	const f = opt?.short ? 'd MMM' : 'd MMMM';
	return `${capitalize(formatInTimeZone(new Date(start), TZ, f, { locale: sv }))} - ${capitalize(formatInTimeZone(new Date(end), TZ, f, { locale: sv }))}`.replaceAll(
		'.',
		''
	);
}

export function formatMonthYear(date: DateType): string {
	if (!date) return '';

	return capitalize(formatInTimeZone(new Date(date), TZ, 'MMMM yyyy', { locale: sv }));
}

export function formatTimeRange(start: DateType, end: DateType): string {
	if (!start || !end) return '';
	return `${formatInTimeZone(new Date(start), TZ, 'HH:mm', { locale: sv })} - ${formatInTimeZone(new Date(end), TZ, 'HH:mm', { locale: sv })}`;
}

export function formatPrice(price: number | null): string {
	if (!price) return '';
	const nf = new Intl.NumberFormat(`se-SV`);
	return `${nf.format(price)} kr`;
}
