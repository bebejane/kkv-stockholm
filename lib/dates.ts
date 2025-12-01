import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { sv } from 'date-fns/locale';
import { TZ } from './constants';
import { capitalize } from 'next-dato-utils/utils';
import { DateTimeFieldValue } from '@datocms/cma-client';

export type DateType = string | Date | DateTimeFieldValue;

export function tzDate(date: DateType): Date {
	if (date === null) throw new Error('date is required');
	return toZonedTime(new Date(date), TZ);
}

export function tzFormat(date: DateType, f: string): string {
	if (date === null) throw new Error('date is required');
	return capitalize(formatInTimeZone(new Date(date), TZ, f, { locale: sv }));
}

export function formatDateInput(date: DateType): string {
	return tzFormat(date, 'yyyy-MM-dd');
}

export function formatDate(date: DateType): string {
	return tzFormat(date, 'd MMMM yyyy');
}

export function formatDateRange(start: DateType, end: DateType, opt?: { short: boolean }): string {
	if (!start || !end) return '';
	const f = opt?.short ? 'd MMM' : 'd MMMM';
	return `${tzFormat(start, f)} - ${tzFormat(end, f)}`.replaceAll('.', '');
}
export function formatDateTimeRange(
	start: DateType,
	end: DateType,
	opt?: { short: boolean }
): string {
	if (!start || !end) return '';
	const f = opt?.short ? 'd MMM HH:mm' : 'd MMMM HH:mm';
	return `${tzFormat(start, f)} - ${tzFormat(end, f)}`.replaceAll('.', '');
}

export function formatMonthYear(date: DateType): string {
	return tzFormat(date, 'MMMM yyyy');
}

export function formatTimeRange(start: DateType, end: DateType): string {
	return `${tzFormat(start, 'HH:mm')} - ${tzFormat(end, 'HH:mm')}`;
}
