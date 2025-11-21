import { client, ApiError } from '@/lib/client';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import { Booking } from '@/types/schema';
import { sendBookingCreatedEmail } from '@/lib/emails';
import { ZodError, z } from 'zod/v4';
import { bookingSchema, bookingCreateSchema, bookingUpdateSchema } from '@/lib/schemas';
import { getSession } from '@/auth/utils';

export async function createBooking(data: Partial<Item<Booking>>): Promise<Item<Booking>> {
	try {
		const session = await getSession();
		const newBookingData = bookingCreateSchema.parse(data);
		const itemTypes = await client.itemTypes.list();
		const bookingType = itemTypes.find((item) => item.api_key === 'booking');

		if (!bookingType) throw new Error('"booking" item type not found');

		const booking = await client.items.create<Booking>({
			item_type: {
				id: bookingType.id as Booking['itemTypeId'],
				type: 'item_type',
			},
			...newBookingData,
		});
		await sendBookingCreatedEmail({ to: session.user.email as string, name: session.user.name as string, booking });
		return booking;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		throw e;
	}
}

export async function updateBooking(id: string, data: Partial<Item<Booking>>): Promise<Item<Booking>> {
	if (!id) throw new Error('Booking Id is required');
	if (!data) throw new Error('Booking data is required');

	try {
		const session = await getSession();
		const updatedBookingData = bookingUpdateSchema.parse(data);
		const booking = await client.items.update<Booking>(id, updatedBookingData);
		return booking;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		throw e;
	}
}

export async function cancelBooking(id: string): Promise<void> {
	if (!id) throw new Error('Booking Id is required');
	try {
		const session = await getSession();
		const booking = await getBooking(id);
		if (!booking) throw new Error('Booking not found');
		await removeBooking(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}
export async function removeBooking(id: string): Promise<void> {
	if (!id) throw new Error('Booking Id is required');
	try {
		const session = await getSession();
		await client.items.destroy(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export async function getBooking(id: string): Promise<Item<Booking> | null> {
	if (!id) return null;
	const session = await getSession();
	const booking = (
		await client.items.list<Booking>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'booking',
				fields: {
					id: { eq: id },
				},
			},
		})
	)?.[0];

	return booking ?? null;
}
