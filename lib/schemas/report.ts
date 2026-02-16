import { z, uuid, uuidNullable, isoDateTime } from './base';

export const reportHoursSchema = z.coerce
	.number()
	.min(1, { error: 'Minmum 5 timmar' })
	.max(5, { error: 'Maximum 5 timmar' })
	.or(z.literal(''));

export const reportDaysSchema = z.coerce
	.number()
	.min(1, { error: 'Minmum 1 dag' })
	.max(365, { error: 'Maximum 365 dagar' })
	.or(z.literal(''));

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
	extra_cost: z.coerce.number().optional(),
	date: isoDateTime,
	assistants: z.array(assistantsSchema).optional(),
});

export const reportCreateSchema = reportSchema
	.omit({
		id: true,
	})
	.extend({
		assistants: z.array(assistantsSchema.omit({ id: true })).optional(),
	});

export const reportUpdateSchema = reportCreateSchema;
