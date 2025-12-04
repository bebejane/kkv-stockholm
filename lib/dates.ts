import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { sv } from 'date-fns/locale';
import { TZ } from './constants';
import { capitalize } from 'next-dato-utils/utils';
import { DateTimeFieldValue } from '@datocms/cma-client';
import { isAfter, isBefore } from 'date-fns';

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

	// Jämför datumvärdena direkt (bara datum, inte tid)
	const startDate = tzDate(start);
	const endDate = tzDate(end);
	const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

	const f = opt?.short ? 'd MMM' : 'd MMMM';
	const startFormatted = tzFormat(start, f).replaceAll('.', '');

	// Om start och end är samma datum, visa bara start
	if (startDateOnly.getTime() === endDateOnly.getTime()) {
		return startFormatted;
	}

	const endFormatted = tzFormat(end, f).replaceAll('.', '');
	return `${startFormatted} - ${endFormatted}`;
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
	const startTime = tzFormat(start, 'HH:mm');
	const endTime = tzFormat(end, 'HH:mm');

	// Om start och end är samma, visa bara start
	if (startTime === endTime) {
		return startTime;
	}

	return `${startTime} – ${endTime}`;
}

export function isAfterOrSame(d1?: Date, d2?: Date) {
	if (!d1 || !d2) return false;
	return isAfter(d1, d2) || d1 === d2;
}

export function isBeforeOrSame(d1?: Date, d2?: Date) {
	if (!d1 || !d2) return false;
	return isBefore(d1, d2) || d1 === d2;
}
