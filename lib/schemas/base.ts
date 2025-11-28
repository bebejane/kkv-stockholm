import { TZ } from '@/lib/constants';
import { format, toDate, toZonedTime } from 'date-fns-tz';
import { sv } from 'date-fns/locale';
import { z } from 'zod/v4';
export { z };

export const uuid = z.base64url();
export const uuidNullable = z.string().nullish().or(z.undefined()).or(uuid);
export const slug = z
	.string()
	.min(1, { error: 'Slug är obligatoriskt' })
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: 'Slug är ogiltig' });

export const structuredText = z
	.object({
		schema: z.literal('dast'),
		document: z.object({}).loose(),
	})
	.or(z.string().min(1, { error: 'Texten är obligatorisk' }));

export const password = z.string().min(6, { error: 'Lösenord är obligatoriskt' });
export const email = z.email({ error: 'Ogiltig e-postadress' });
export const token = z.string().min(128, { error: 'Token är ogiltig' });
export const isoDateTime = z.preprocess(
	(str) => {
		const parsedDate = toDate(str as string);
		const f = format(toZonedTime(parsedDate, TZ), "yyyy-MM-dd'T'HH:mm:ssxxx", { timeZone: TZ, locale: sv });
		return f;
	},
	z.iso.datetime({ offset: true })
);

export const upload = z.object({
	upload_id: uuid,
	url: z.url(),
});

export const image = z
	.object({
		upload_id: z.base64url({ error: 'Bild är obligatoriskt' }),
	})
	.or(z.base64url({ error: 'Bild är obligatoriskt' }));
