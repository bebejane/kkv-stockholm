import 'dotenv/config';
import { client } from './lib/client';
import { Course } from '@/types/datocms';
import { FieldInstancesTargetSchema } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import fs from 'fs';

const general = `
export const uuid = z.base64url().refine((val) => /^[A-Za-z0-9_-]{22}$/.test(val), { message: 'Invalid Id: Wrong UUID format' });
export const uuidNullable = z.string().nullish().or(z.undefined()).or(uuid);
export const file = z.object({upload_id: uuid,url: z.string()});
export const slug = z.string().min(1, { message: 'Slug är obligatoriskt' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug är ogiltig' });
export const structuredText = z.object({schema: z.literal('dast'),document: z.object({}).loose()});
export const url = z.url({ message: 'Url är ogiltig' }).or(z.literal('')).transform((url) => url || undefined),
`;

function fieldToZodDefimition({ api_key, label, field_type, validators }: FieldInstancesTargetSchema[0]): string {
	switch (field_type) {
		case 'string':
		case 'text':
		case 'rich_text':
			const v = [];
			if (validators?.formats?.predifined_pattern === 'url') return `url`;
			if (validators?.formats?.predifined_pattern === 'email') return `email`;

			validators.length?.min && v.push(`min(${validators.length.min}, { message: \'${label} är för kort\' })`);
			validators.length?.max && v.push(`max(${validators.length.max}, { message: \'${label} är för långt\' })`);
			if (typeof validators.length === 'object') {
				if (validators.length.eq) {
					v.push(`length(${validators.length.eq}, { message: \'${label} är felaktigt längd\'})`);
				} else {
					v.push(`.min(${validators.length.min}, { message: \'${label} är obligatoriskt\' })`);
					v.push(`.max(${validators.length.max}, { message: \'${label} är för långt\' })`);
				}
			}

			return `z.string()${v.join('.')}`;
		case 'boolean':
			return `z.boolean()`;
		case 'link':
			if (validators.required) return 'uuid';
			else return `uuidNullable`;
		case 'links':
			return `z.array(uuid)`;
		case 'date':
			return `z.iso.date()`;
		case 'date_time':
			return `z.iso.datetime()`;
		case 'color':
			return `z.string()`;
		case 'file':
			return `z.object({
				upload_id: uuid,
				url: z.string(),
			})`;
		case 'gallery':
			return `z.array(file)`;
		case 'json':
			return `z.object()`;
		case 'float':
			return `z.number().positive()`;
		case 'integer':
			return `z.number().positive()`;
		case 'slug':
			return `slug`;
		case 'structured_text':
			return `structuredText`;
		case 'video':
			return `z.object({
				upload_id: uuid,
				url: z.string(),
			})`;
		case 'lat_lon':
			return `z.object({
				lat: z.number(),
				lon: z.number(),
			})`;
		case 'seo':
			return `z.object()`;
		case 'single_block':
			return `z.object()`;
	}
}

async function test() {
	const api_key = 'about';
	const model = (await client.itemTypes.list()).find((m) => m.api_key === api_key);
	if (!model) throw new Error('Model not found');
	const fields = (await client.fields.list(model.id)).sort((a, b) => (a.position > b.position ? 1 : -1));
	const defs = fields.map((f) => `${f.api_key}: ${fieldToZodDefimition(f)}`).join(',\n');

	const schema = `
import { z } from 'zod';
	${general}
export const schema = z.object({
	${defs}
});

/*
${JSON.stringify(fields, null, 2)}
*/
`;

	fs.writeFileSync(`./schema-${api_key}.ts`, schema);
	//fs.writeFileSync('./fields.json', JSON.stringify(fields, null, 2));
}

test();
