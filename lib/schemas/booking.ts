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

export const bookingCreateSchema = z
	.object({
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

export const bookingValidateSchema = z
	.object({
		workshop: uuid,
		equipment: z.array(uuid),
		start: isoDateTime,
		end: isoDateTime,
	})
	.superRefine((data, ctx) => {
		if (isAfter(new Date(data.start), new Date(data.end)))
			ctx.addIssue({
				code: 'custom',
				error: 'Startdatum måste vara före slutdatum',
				path: ['start'],
			});
	});

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
	workshopId: uuid,
	equipmentIds: z.array(uuid),
	start: isoDateTime,
	end: isoDateTime,
	mode: z.enum(['view', 'edit']),
});

/**
 * Member-facing variant: `mode` is never taken from the client. Member routes
 * always run in `edit` scope so other members' bookings are not exposed.
 */
export const bookingSearchMemberSchema = bookingSearchSchema.omit({ mode: true });

export const bookingAvilabilitySchema = bookingSearchSchema;

export const bookingAvilabilityMemberSchema = bookingSearchMemberSchema;
