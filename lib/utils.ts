import { ZodObject } from 'zod';
import { ApiError } from '@datocms/cma-client';
import { ZodError } from 'zod';
import { APIError } from 'better-auth';
import { tzDate } from '@/lib/dates';

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
		return `Validation error: ${e.issues.map((i) => `"${i.path.join('.')}" - ${i.message}`).join('\n')}`;
	} else if (e instanceof Error) return e.message;
	else if (typeof e === 'string') return e;
	else return 'Unknown error';
};

export type GroupSlot = {
	start: Date;
	end: Date;
	state: 'shared' | 'unavailable' | 'you' | 'selection';
	bookings: AllBookingsSearchQuery['allBookings'];
};

export const groupBookingSlots = (
	bookings: AllBookingsSearchQuery['allBookings'] | null,
	userId?: string,
): GroupSlot[] => {
	if (!bookings) return [];

	// Clone and sort bookings by start time
	bookings = [...bookings].sort((a, b) => tzDate(a.start).getTime() - tzDate(b.start).getTime());

	const getSlotState = (bookingList: AllBookingsSearchQuery['allBookings']): GroupSlot['state'] => {
		if (userId && bookingList.some((b) => b.member.user === userId)) return 'you';
		if (bookingList.some((b) => b.equipment.some((e) => e.exclusive))) return 'unavailable';

		return 'shared';
	};

	const slots: GroupSlot[] = [];
	let currentSlot: GroupSlot | undefined;
	for (const booking of bookings) {
		const individualState = getSlotState([booking]);

		if (
			currentSlot &&
			tzDate(booking.start).getTime() < tzDate(currentSlot.end).getTime() &&
			individualState === currentSlot.state
		) {
			currentSlot.end = new Date(
				Math.max(tzDate(currentSlot.end).getTime(), tzDate(booking.end).getTime()),
			);
			currentSlot.bookings.push(booking);
			currentSlot.state = getSlotState(currentSlot.bookings);
		} else {
			currentSlot = {
				start: tzDate(booking.start),
				end: tzDate(booking.end),
				bookings: [booking],
				state: individualState,
			};
			slots.push(currentSlot);
		}
	}
	slots.sort((a, b) => a.start.getTime() - b.start.getTime());
	return slots;
};
