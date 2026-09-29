import { client } from '@/lib/client';
import { Item } from '@/lib/client';
import { Booking } from '@/types/datocms';
import { findById, findWithLinked, getItemTypeIds } from './utils';
import { safeSendEmail, sendBookingCreatedEmail } from '@/lib/controllers/email';
import { bookingCreateSchema, bookingValidateSchema } from '@/lib/schemas/booking';
import { getMemberSession } from '@/auth/utils';
import { EquipmentType, find as findEquipment } from '@/lib/controllers/equipment';
import { WorkshopType, WorkshopTypeLinked } from '@/lib/controllers/workshop';
import { tzDate } from '@/lib/dates';
import { isBefore } from 'date-fns';
import { apiQuery } from 'next-dato-utils/api';
import { AllBookingsSearchDocument } from '@/graphql';
import { ValidationError, NotFoundError, BadRequestError, ConflictError } from '@/lib/errors';
import { ErrorMessages } from '@/lib/error-messages';

export type BookingType = Item<Booking>;
export type BookingTypeLinked = Omit<BookingType, 'equipment' | 'workshop'> & {
	equipment: EquipmentType[];
	workshop: WorkshopTypeLinked;
};

function toLinkIds(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value
		.map((item) =>
			typeof item === 'string' ? item : ((item as { id?: string } | null)?.id ?? null),
		)
		.filter((id): id is string => Boolean(id));
}

/**
 * Rejects bookings whose equipment does not belong to the submitted workshop or
 * is not marked as bookable. The UI filters this, but the API must enforce it.
 */
async function validateBookingEquipment(
	workshopId: string,
	equipmentIds: string[],
): Promise<void> {
	const workshop = await findById<WorkshopType>(workshopId, 'workshop');
	if (!workshop) throw new NotFoundError('Workshop', workshopId);

	const workshopEquipmentIds = toLinkIds(workshop.equipment);

	for (const equipmentId of equipmentIds) {
		if (!workshopEquipmentIds.includes(equipmentId))
			throw new BadRequestError(ErrorMessages.EQUIPMENT_NOT_IN_WORKSHOP);

		const equipment = await findEquipment(equipmentId);
		if (!equipment) throw new NotFoundError('Equipment', equipmentId);
		if (equipment.bookable !== true)
			throw new BadRequestError(ErrorMessages.EQUIPMENT_NOT_BOOKABLE);
	}
}

export async function create(data: Partial<BookingType>): Promise<BookingTypeLinked | null> {
	const { member } = await getMemberSession();

	const newBookingData = bookingCreateSchema.parse({
		...data,
		member: member.id as string,
	});

	await validateBookingEquipment(newBookingData.workshop, newBookingData.equipment);

	const available = await availability(newBookingData, member.user as string, 'edit');

	if (!available) throw new ConflictError(ErrorMessages.BOOKING_EQUIPMENT_UNAVAILABLE);

	const { booking: bookingTypeId } = await getItemTypeIds(['booking']);
	const { id } = await client.items.create<Booking>({
		item_type: {
			id: bookingTypeId as Booking['itemTypeId'],
			type: 'item_type',
		},
		...newBookingData,
	});

	const booking = await find(id);
	if (!booking) throw new NotFoundError('Booking', id);

	// The booking is already created; a mail failure must not fail the request.
	await safeSendEmail(() =>
		sendBookingCreatedEmail({
			to: member.email as string,
			name: member.first_name as string,
			booking,
		}),
	);

	return booking;
}

export async function find(id: string): Promise<BookingTypeLinked | null> {
	if (!id) return null;
	const booking = await findWithLinked<BookingTypeLinked>(id, 1);
	return booking;
}

export async function findAll(): Promise<BookingTypeLinked[]> {
	const ids: string[] = [];
	for await (const booking of client.items.listPagedIterator<Booking>({
		filter: {
			type: 'booking',
		},
	})) {
		ids.push(booking.id);
	}

	return Promise.all(ids.map((id) => find(id))) as Promise<BookingTypeLinked[]>;
}

export async function findByRange(start: Date, end?: Date): Promise<BookingTypeLinked[]> {
	if (!start) throw new BadRequestError(ErrorMessages.BOOKING_DATE_RANGE_INVALID);
	if (!(start instanceof Date)) throw new BadRequestError(ErrorMessages.START_DATE_INVALID);
	if (end && !(end instanceof Date)) throw new BadRequestError(ErrorMessages.END_DATE_INVALID);

	const ids: string[] = [];
	for await (const booking of client.items.listPagedIterator<Booking>({
		filter: {
			type: 'booking',
			fields: {
				start: { gte: start.toISOString() },
				end: end ? { lte: end.toISOString() } : undefined,
			},
		},
	})) {
		ids.push(booking.id);
	}

	return Promise.all(ids.map((id) => find(id))) as Promise<BookingTypeLinked[]>;
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
	if (!id) throw new BadRequestError(ErrorMessages.BOOKING_ID_REQUIRED);
	return await client.items.update<Booking>(id, { aborted: new Date().toISOString() });
}

export async function search(
	variables: {
		workshopId: string;
		equipmentIds: string[];
		start: string;
		end: string;
	},
	_userId: string,
	mode: 'view' | 'edit',
): Promise<AllBookingsSearchQuery['allBookings']> {
	let { allBookings, _allBookingsMeta } = await apiQuery(AllBookingsSearchDocument, {
		all: true,
		revalidate: 0,
		variables,
	});
	if (mode === 'edit')
		allBookings = filterAvailableBookings(
			allBookings as BookingRecord[],
			variables.equipmentIds,
			_userId,
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
		throw new BadRequestError(ErrorMessages.BOOKING_DATE_IN_PAST);

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
					.filter(({ id, exclusive }) => equipmentIds.includes(id) && exclusive)
					.some((e) => e.exclusive)
			)
				return true;

			return false;
		}) ?? []
	);
}
