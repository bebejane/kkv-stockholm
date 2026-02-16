import { ZodObject } from 'zod';
import { ApiError } from '@datocms/cma-client';
import { ZodError } from 'zod';
import { APIError } from 'better-auth';

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
		} as any,
	);
}

export const parseErrorMessage = (e: any): string => {
	if (e instanceof ApiError) {
		const errors = e.errors
			.map(
				(e) =>
					`${e.attributes.code}: ${typeof e.attributes.details === 'string' ? e.attributes.details : JSON.stringify(e.attributes.details)}`,
			)
			.join('\n');
		return `${errors}`;
	} else if (e instanceof APIError)
		return e.message; //BetterAuth error
	else if (e instanceof ZodError) {
		return `ZodError (${e.name}): "${e.message}"\n${e.issues.map((e) => `\t${e.path.join('.')}: ${e.message}`).join('\n')}`;
	} else if (e instanceof Error) return e.message;
	else if (typeof e === 'string') return e;
	else return 'Unknown error';
};
