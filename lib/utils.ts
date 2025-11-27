import { formatInTimeZone } from 'date-fns-tz';
import { sv } from 'date-fns/locale';
import { TZ } from './constants';
import { capitalize } from 'next-dato-utils/utils';
import { DateTimeFieldValue } from '@datocms/cma-client';
import { ZodObject } from 'zod';
import { ApiError } from '@datocms/cma-client';
import { ZodError } from 'zod';
import { APIError } from 'better-auth';

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

export function createInitialFormValues(schema: ZodObject, obj?: any): any {
	return schema.keyof().options.reduce(
		(acc, key) => {
			(typeof acc[key] === 'undefined' || acc[key] === null) && (acc[key] = '');
			return acc;
		},
		{
			...(obj ?? {}),
		} as any
	);
}

export const getErrorMessage = (e: any): string => {
	if (e instanceof Error) return e.message;
	if (e instanceof ApiError) return e.message; //DatoCms error
	if (e instanceof APIError) return e.message; //BetterAuth error
	if (e instanceof ZodError) {
		return `ZodError (${e.name}): "${e.message}"\n${e.issues.map((e) => `\t${e.path.join('.')}: ${e.message}`).join('\n')}`;
	}
	if (typeof e === 'string') return e;
	return 'Unknown error';
};
