import { z, uuid, uuidNullable, isoDateTime } from './base';

export const reportHoursSchema = z.coerce.number().min(0).max(5);
export const reportDaysSchema = z.coerce.number().min(0).max(365);
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
