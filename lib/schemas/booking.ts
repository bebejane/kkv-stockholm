import { isAfter } from 'date-fns';
import { z, uuid, uuidNullable, isoDateTime } from './base';

export const bookingSchema = z
	.object({
		id: uuid,
		workshop: uuid,
		equipment: z.array(uuid),
		member: uuid,
		start: isoDateTime,
		end: isoDateTime,
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

export const bookingCreateSchema = bookingSchema
	.omit({
		id: true,
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({
				code: 'custom',
				error: 'Startdatum måste vara före slutdatum',
				path: ['start'],
			});
	});

export const bookingCreateFormSchema = bookingSchema
	.pick({
		workshop: true,
		equipment: true,
		start: true,
		end: true,
		note: true,
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({
				code: 'custom',
				error: 'Startdatum måste vara före slutdatum',
				path: ['start'],
			});
	});

export const bookingUpdateSchema = bookingSchema
	.omit({
		id: true,
		member: true,
		workshop: true,
		equipment: true,
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
	equipmentId: z.array(uuid).optional(),
	start: z.iso.datetime(),
	end: z.iso.datetime(),
});
