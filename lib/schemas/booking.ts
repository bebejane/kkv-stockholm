import { isAfter } from 'date-fns';
import { z, uuid, uuidNullable, isoDateTime } from './base';

export const bookingSchema = z
	.object({
		id: uuidNullable,
		workshop: uuid,
		equipment: z.array(uuid),
		member: uuid,
		start: isoDateTime,
		end: isoDateTime,
		aborted: isoDateTime.optional(),
		note: z.string().optional(),
		report: uuidNullable,
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({
				code: 'custom',
				error: 'Startdatum måste vara före slutdatum',
				path: ['start'],
			});
	});

export const bookingCreateSchema = bookingSchema;

export const bookingCreateFormSchema = z
	.object({
		workshop: uuid,
		equipment: z.array(uuid),
		start: isoDateTime,
		end: isoDateTime,
		note: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({
				code: 'custom',
				error: 'Startdatum måste vara före slutdatum',
				path: ['start'],
			});
	});

export const bookingUpdateSchema = z
	.object({
		start: isoDateTime,
		end: isoDateTime,
		aborted: isoDateTime.optional(),
		note: z.string().optional(),
		report: uuidNullable,
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({
				code: 'custom',
				error: 'Startdatum måste vara före slutdatum',
				path: ['start'],
			});
	});

export const bookingSearchSchema = z.object({
	workshopId: uuidNullable,
	equipmentIds: z.array(uuid).optional(),
	start: z.iso.datetime(),
	end: z.iso.datetime(),
});
