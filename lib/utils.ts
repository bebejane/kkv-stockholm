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
		} as any
	);
}

export const parseErrorMessage = (e: any): string => {
	console.log(JSON.stringify(e, null, 2));
	if (e instanceof Error) return e.message;
	if (e instanceof ApiError) {
		const m = e.message;
		const errors = e.errors.map((e) => `${e.attributes.code}: ${e.attributes.details}`).join('\n');
		return `${m}\n${errors}`;
	}
	if (e instanceof APIError) return e.message; //BetterAuth error
	if (e instanceof ZodError) {
		return `ZodError (${e.name}): "${e.message}"\n${e.issues.map((e) => `\t${e.path.join('.')}: ${e.message}`).join('\n')}`;
	}
	if (typeof e === 'string') return e;
	return 'Unknown error';
};
