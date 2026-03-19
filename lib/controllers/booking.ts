import { client } from '@/lib/client';
import { Item } from '@/lib/client';
import { Booking } from '@/types/datocms';
import { findWithLinked, getItemTypeIds } from './utils';
import { sendBookingAbortledEmail, sendBookingCreatedEmail } from '@/lib/controllers/email';
import {
	bookingCreateSchema,
	bookingSearchSchema,
	bookingUpdateSchema,
	bookingValidateSchema,
} from '@/lib/schemas/booking';
import { getMemberSession } from '@/auth/utils';
import { EquipmentType } from '@/lib/controllers/equipment';
import { WorkshopTypeLinked } from '@/lib/controllers/workshop';
import { tzDate } from '@/lib/dates';
import { isBefore } from 'date-fns';
import { apiQuery } from 'next-dato-utils/api';
import { AllBookingsSearchDocument } from '@/graphql';

export type BookingType = Item<Booking>;
export type BookingTypeLinked = Omit<BookingType, 'equipment' | 'workshop'> & {
	equipment: EquipmentType[];
	workshop: WorkshopTypeLinked;
};

export async function create(data: Partial<BookingType>): Promise<BookingTypeLinked | null> {
	const { member } = await getMemberSession();
	const newBookingData = bookingCreateSchema.parse({
		...data,
		member: member.id as string,
	});

	const available = await availability(newBookingData, member.user as string, 'edit');

	if (!available) throw new Error('Utrustningen i verkstaden är redan bokad för tidsperioden');

	const { booking: bookingTypeId } = await getItemTypeIds(['booking']);
	const { id } = await client.items.create<Booking>({
		item_type: {
			id: bookingTypeId as Booking['itemTypeId'],
			type: 'item_type',
		},
		...newBookingData,
	});

	const booking = await find(id);
	if (!booking) throw new Error('Booking not found withg id: ' + id);

	await sendBookingCreatedEmail({
		to: member.email as string,
		name: member.first_name as string,
		booking,
	});

	return booking;
}

export async function update(id: string, data: Partial<BookingType>): Promise<BookingType> {
	if (!id) throw new Error('Booking Id is required');
	if (!data) throw new Error('Booking data is required');

	const updatedBookingData = bookingUpdateSchema.parse(data);
	const booking = await client.items.update<Booking>(id, updatedBookingData);
	return booking;
}

export async function remove(id: string): Promise<void> {
	if (!id) throw new Error('Booking Id is required');
	const booking = await find(id);
	const session = await getMemberSession();
	if (!booking) throw new Error('Booking not found');
	await client.items.destroy(id);
	await sendBookingAbortledEmail({
		to: session.user.email as string,
		name: session.member.first_name as string,
		booking,
	});
}

export async function find(id: string): Promise<BookingTypeLinked | null> {
	if (!id) return null;
	console.time(`find booking ${id}`);
	const booking = await findWithLinked<BookingTypeLinked>(id, 1);
	console.timeEnd(`find booking ${id}`);
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

export async function abort(id: string): Promise<BookingType> {
	if (!id) throw new Error('Booking Id is required');
	console.log('abort', id);
	return await client.items.update<Booking>(id, { aborted: tzDate(new Date()).toISOString() });
}

export async function search(
	query: {
		workshopId: string;
		equipmentIds: string[];
		start: string;
		end: string;
	},
	userId: string,
	mode: 'view' | 'edit',
): Promise<AllBookingsSearchQuery['allBookings']> {
	const variables = bookingSearchSchema.parse(query);

	let { allBookings, _allBookingsMeta } = await apiQuery(AllBookingsSearchDocument, {
		all: true,
		revalidate: 0,
		variables,
	});
	if (mode === 'edit')
		allBookings = filterAvailableBookings(
			allBookings as BookingRecord[],
			variables.equipmentIds,
			userId,
		);
	console.log('booking search', variables, _allBookingsMeta.count);
	return allBookings as BookingRecord[];
}

export async function availability(
	b: Partial<BookingType>,
	userId: string,
	mode: 'view' | 'edit',
): Promise<boolean> {
	const { start, end, workshop, equipment } = bookingValidateSchema.parse(b);

	if (isBefore(tzDate(start), tzDate(new Date())))
		throw new Error('Start datum och tid är innan nu.');

	const bookings = await search(
		{
			workshopId: workshop,
			equipmentIds: equipment,
			start,
			end,
		},
		userId,
		mode,
	);

	return bookings.length === 0;
}

export function filterAvailableBookings(
	bookings: BookingRecord[] | undefined,
	equipmentIds: string[] | undefined,
	userId: string | undefined | null,
): BookingRecord[] {
	return (
		bookings?.filter((b) => {
			if (b.member.user === userId || !equipmentIds?.length) return true;
			if (
				b.equipment
					.filter(({ id, exclusive }) => equipmentIds?.includes(id) && exclusive)
					.some((e) => e.exclusive)
			)
				return true;

			return false;
		}) ?? []
	);
}
