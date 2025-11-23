import { client, ApiError } from '@/lib/client';
import { Item } from '@/lib/client';
import { Booking, Equipment, Workshop } from '@/types/datocms';
import { findWithLinked, getItemTypeIds } from './utils';
import { sendBookingCreatedEmail } from '@/lib/controller/email';
import { ZodError, z } from 'zod/v4';
import { bookingCreateSchema, bookingUpdateSchema } from '@/lib/schemas';
import { getUserSession } from '@/auth/utils';
import { EquipmentType } from '@/lib/controller/equipment';
import { WorkshopType, WorkshopTypeLinked } from '@/lib/controller/workshop';

export type BookingType = Item<Booking>;
export type BookingTypeLinked = Omit<BookingType, 'equipment' | 'workshop'> & {
	equipment: EquipmentType[];
	workshop: WorkshopTypeLinked;
};

export async function create(data: Partial<BookingType>): Promise<BookingType> {
	try {
		const session = await getUserSession();
		const newBookingData = bookingCreateSchema.parse(data);
		const { booking: bookingTypeId } = await getItemTypeIds(['booking']);
		const booking = await client.items.create<Booking>({
			item_type: {
				id: bookingTypeId as Booking['itemTypeId'],
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

export async function update(id: string, data: Partial<BookingType>): Promise<BookingType> {
	if (!id) throw new Error('Booking Id is required');
	if (!data) throw new Error('Booking data is required');

	try {
		const updatedBookingData = bookingUpdateSchema.parse(data);
		const booking = await client.items.update<Booking>(id, updatedBookingData);
		return booking;
	} catch (e) {
		if (e instanceof ZodError) throw new Error(JSON.stringify(e.issues));
		throw e;
	}
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new Error('Booking Id is required');
	try {
		const session = await getUserSession();
		await client.items.destroy(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export async function find(id: string): Promise<BookingTypeLinked | null> {
	if (!id) return null;
	console.time(`find ${id}`);
	const booking = await findWithLinked<BookingTypeLinked>(id, 'booking');
	console.timeEnd(`find ${id}`);
	return booking;
}

export async function findAll(): Promise<BookingTypeLinked[]> {
	const bookings = await client.items.list<Booking>({
		page: {
			limit: 500,
		},
		filter: {
			type: 'booking',
		},
	});

	return Promise.all(bookings.map(({ id }) => find(id))) as Promise<BookingTypeLinked[]>;
}

export async function findByRange(start: Date, end?: Date): Promise<BookingTypeLinked[]> {
	if (!start) throw new Error('Start or end date is required');
	if (!(start instanceof Date)) throw new Error('Start date is not a Date object');
	if (end && !(end instanceof Date)) throw new Error('End date is not a Date object');

	const bookings = await client.items.list<Booking>({
		filter: {
			type: 'booking',
			fields: {
				start: { gte: start.toISOString() },
				end: end ? { lte: end.toISOString() } : undefined,
			},
		},
	});

	return Promise.all(bookings.map(({ id }) => find(id))) as Promise<BookingTypeLinked[]>;
}

export async function findFuture(): Promise<BookingTypeLinked[]> {
	const now = new Date();
	return await findByRange(now);
}

export async function findPast(): Promise<BookingTypeLinked[]> {
	const start = new Date();
	start.setFullYear(1970, 0, 0);
	const end = new Date();
	return await findByRange(start, end);
}

export async function cancel(id: string): Promise<void> {
	if (!id) throw new Error('Booking Id is required');
	try {
		const booking = await find(id);
		if (!booking) throw new Error('Booking not found');
		await remove(id);
	} catch (e) {
		console.log(e);
		throw e;
	}
}
