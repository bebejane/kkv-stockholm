import { z, uuid, uuidNullable, isoDateTime } from './base';

export const reportHoursSchema = z.coerce
	.number()
	.min(0, { error: 'Minmum 0 timmar' })
	.max(5, { error: 'Maximum 5 timmar' })
	.or(z.literal(''))
	.or(z.literal(null))
	.pipe(z.transform((val) => (val === '' || val === 0 ? null : Number(val))));

export const reportDaysSchema = z.coerce
	.number()
	.min(1, { error: 'Minmum 1 dag' })
	.max(365, { error: 'Maximum 365 dagar' })
	.or(z.literal(''))
	.or(z.literal(null))
	.pipe(z.transform((val) => (val === '' || val === 0 ? null : Number(val))));

export const reportExtraSchema = z.coerce
	.number()
	.min(1, { error: 'Minmum 1kr' })
	.or(z.literal(''))
	.or(z.literal(null))
	.pipe(z.transform((val) => (val === '' || val === 0 ? null : Number(val))));

export const assistantsSchema = z.object({
	id: uuid,
	hours: reportHoursSchema,
	days: reportDaysSchema,
});

export const reportSchema = z.object({
	id: uuid,
	member: uuidNullable,
	booking: uuidNullable,
	workshop: uuid,
	hours: reportHoursSchema,
	days: reportDaysSchema,
	extra_cost: reportExtraSchema,
	date: isoDateTime,
	assistants: z.array(assistantsSchema).optional(),
});

export const reportCreateSchema = reportSchema
	.omit({
		id: true,
	})
	.extend({
		assistants: z.array(assistantsSchema.omit({ id: true })).optional(),
	})
	.superRefine((data, ctx) => {
		if (
			!data.hours &&
			!data.days &&
			!data.extra_cost &&
			!data.assistants?.some((assistant) => assistant.hours || assistant.days)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['hours'],
				message:
					'Minst en timmar eller dag eller extra kost eller assistant måste ha minst 1 timme eller 1 dag.',
			});
		}
	});

export const reportUpdateSchema = reportCreateSchema;
