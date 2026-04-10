import { NextRequest, NextResponse } from 'next/server';
import { apiQuery } from 'next-dato-utils/api';
import { AllEquipmentDocument, AllWorkshopsDocument, AllMembersDocument } from '@/graphql';
import { startOfDay, endOfDay } from 'date-fns';

const notes = [
	null,
	null,
	null,
	null,
	null,
	'Behöver extra tid för projektet',
	'Kommer tidigt',
	'Kvällsarbete',
	'Helgdagsprojekt',
	'Endast en timme',
	'Tar eget material',
	'Grupprojekt',
	'Vill ha hjälp med inställningar',
	'Första gången jag använder utrustningen',
	'Jätteviktigt projekt!',
	'',
	'Morgonpass',
	'Eftermiddag',
];

function generateBookingsForRange(
	count: number,
	workshops: any[],
	equipment: any[],
	members: any[],
	rangeStart: Date,
	rangeEnd: Date,
	existingIds: Set<string>,
) {
	const bookings = [];
	const rangeDays = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
	
	for (let i = 0; i < count; i++) {
		const duration = 1 + Math.floor(Math.random() * 4); // 1-4 days
		
		// Start: anywhere from 3 days before to rangeStart
		const start = new Date(rangeStart);
		start.setDate(start.getDate() - Math.floor(Math.random() * 4) - 1);
		start.setHours(7 + Math.floor(Math.random() * 8), 0, 0, 0);
		
		// End: rangeStart to rangeStart + duration + some buffer
		const end = new Date(rangeStart);
		end.setDate(end.getDate() + Math.floor(Math.random() * rangeDays) + duration);
		end.setHours(17 + Math.floor(Math.random() * 4), 0, 0, 0);

		const workshop = workshops[Math.floor(Math.random() * workshops.length)];
		const member = members[Math.floor(Math.random() * members.length)];
		const exclusiveEquipment = equipment.filter((e: any) => e.exclusive);
		const nonExclusiveEquipment = equipment.filter((e: any) => !e.exclusive);

		const selectedEquipment = [];
		if (Math.random() > 0.3 && exclusiveEquipment.length > 0) {
			selectedEquipment.push(exclusiveEquipment[Math.floor(Math.random() * exclusiveEquipment.length)]);
		}
		if (Math.random() > 0.3 && nonExclusiveEquipment.length > 0) {
			selectedEquipment.push(nonExclusiveEquipment[Math.floor(Math.random() * nonExclusiveEquipment.length)]);
		}
		if (selectedEquipment.length === 0 && nonExclusiveEquipment.length > 0) {
			selectedEquipment.push(nonExclusiveEquipment[Math.floor(Math.random() * nonExclusiveEquipment.length)]);
		}

		bookings.push({
			id: `booking_multiday_${Date.now()}_${i}`,
			start: start.toISOString(),
			end: end.toISOString(),
			note: 'Flera dagar',
			aborted: null,
			member,
			workshop,
			equipment: selectedEquipment,
		});
	}
	
	return bookings;
}

function generateBookings(
	count: number,
	workshops: any[],
	equipment: any[],
	members: any[],
	startDate: Date,
	endDate: Date,
	rangeStart?: Date,
	rangeEnd?: Date,
) {
	const bookings = [];
	const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
	const weeks = Math.ceil(daysDiff / 7);

	const userEmail = 'bjorn@konst-teknik.se';
	const userMember = members.find((m: any) => m.email === userEmail) || members[0];

	// Generate multi-day bookings that overlap the requested range
	if (rangeStart && rangeEnd) {
		const rangeDays = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
		
		for (let i = 0; i < 8; i++) {
			const duration = 1 + Math.floor(Math.random() * 4); // 1-4 days
			
			// Start: anywhere from 3 days before to rangeStart
			const start = new Date(rangeStart);
			start.setDate(start.getDate() - Math.floor(Math.random() * 4) - 1);
			start.setHours(7 + Math.floor(Math.random() * 8), 0, 0, 0);
			
			// End: rangeStart to rangeStart + duration + some buffer
			const end = new Date(rangeStart);
			end.setDate(end.getDate() + Math.floor(Math.random() * rangeDays) + duration);
			end.setHours(17 + Math.floor(Math.random() * 4), 0, 0, 0);

			const workshop = workshops[Math.floor(Math.random() * workshops.length)];
			const member = members[Math.floor(Math.random() * members.length)];
			const exclusiveEquipment = equipment.filter((e: any) => e.exclusive);
			const nonExclusiveEquipment = equipment.filter((e: any) => !e.exclusive);

			const selectedEquipment = [];
			if (Math.random() > 0.3 && exclusiveEquipment.length > 0) {
				selectedEquipment.push(exclusiveEquipment[Math.floor(Math.random() * exclusiveEquipment.length)]);
			}
			if (Math.random() > 0.3 && nonExclusiveEquipment.length > 0) {
				selectedEquipment.push(nonExclusiveEquipment[Math.floor(Math.random() * nonExclusiveEquipment.length)]);
			}
			if (selectedEquipment.length === 0 && nonExclusiveEquipment.length > 0) {
				selectedEquipment.push(nonExclusiveEquipment[Math.floor(Math.random() * nonExclusiveEquipment.length)]);
			}

			bookings.push({
				id: `booking_multiday_${i}`,
				start: start.toISOString(),
				end: end.toISOString(),
				note: 'Flera dagar',
				aborted: null,
				member,
				workshop,
				equipment: selectedEquipment,
			});
		}
	}

	for (let week = 0; week < weeks; week++) {
		for (let i = 0; i < 5; i++) {
			const bookingDate = new Date(startDate);
			bookingDate.setDate(bookingDate.getDate() + week * 7 + Math.floor(Math.random() * 7));

			const startHour = 7 + Math.floor(Math.random() * 16);
			
			// 10% chance of multi-day booking
			const isMultiDay = Math.random() < 0.1;
			const duration = isMultiDay 
				? 1 + Math.floor(Math.random() * 5) // 1-5 days
				: 1 + Math.floor(Math.random() * 16);
			const endHour = Math.min(startHour + duration, 23);

			const workshop = workshops[Math.floor(Math.random() * workshops.length)];

			const exclusiveEquipment = equipment.filter((e: any) => e.exclusive);
			const nonExclusiveEquipment = equipment.filter((e: any) => !e.exclusive);

			const selectedEquipment = [];
			if (Math.random() > 0.3 && exclusiveEquipment.length > 0) {
				const exclusive = exclusiveEquipment[Math.floor(Math.random() * exclusiveEquipment.length)];
				selectedEquipment.push(exclusive);
			}

			if (Math.random() > 0.3 && nonExclusiveEquipment.length > 0) {
				const count = 1 + Math.floor(Math.random() * Math.min(3, nonExclusiveEquipment.length));
				const shuffled = [...nonExclusiveEquipment].sort(() => Math.random() - 0.5);
				selectedEquipment.push(...shuffled.slice(0, count));
			}

			if (selectedEquipment.length === 0 && nonExclusiveEquipment.length > 0) {
				selectedEquipment.push(
					nonExclusiveEquipment[Math.floor(Math.random() * nonExclusiveEquipment.length)],
				);
			}

			const start = new Date(bookingDate);
			start.setHours(startHour, 0, 0, 0);

			const end = new Date(bookingDate);
			if (isMultiDay) {
				end.setDate(end.getDate() + Math.floor(duration / 24) + 1);
				end.setHours(17 + Math.floor(Math.random() * 4), 0, 0, 0);
			} else {
				end.setHours(endHour, 0, 0, 0);
			}

			bookings.push({
				id: `booking_user_${week}_${i}`,
				start: start.toISOString(),
				end: end.toISOString(),
				note: notes[Math.floor(Math.random() * notes.length)],
				aborted: null,
				member: userMember,
				workshop,
				equipment: selectedEquipment,
			});
		}
	}

	const remainingCount = count - bookings.length;
	for (let i = 0; i < remainingCount; i++) {
		const randomDays = Math.floor(Math.random() * daysDiff);
		const bookingDate = new Date(startDate);
		bookingDate.setDate(bookingDate.getDate() + randomDays);

		const startHour = 7 + Math.floor(Math.random() * 16);
		
		// 10% chance of multi-day booking
		const isMultiDay = Math.random() < 0.1;
		const duration = isMultiDay 
			? 1 + Math.floor(Math.random() * 5) // 1-5 days
			: 1 + Math.floor(Math.random() * 16);
		const endHour = Math.min(startHour + duration, 23);

		const workshop = workshops[Math.floor(Math.random() * workshops.length)];
		const member = members[Math.floor(Math.random() * members.length)];

		const exclusiveEquipment = equipment.filter((e: any) => e.exclusive);
		const nonExclusiveEquipment = equipment.filter((e: any) => !e.exclusive);

		const selectedEquipment = [];
		if (Math.random() > 0.3 && exclusiveEquipment.length > 0) {
			const exclusive = exclusiveEquipment[Math.floor(Math.random() * exclusiveEquipment.length)];
			selectedEquipment.push(exclusive);
		}

		if (Math.random() > 0.3 && nonExclusiveEquipment.length > 0) {
			const count = 1 + Math.floor(Math.random() * Math.min(3, nonExclusiveEquipment.length));
			const shuffled = [...nonExclusiveEquipment].sort(() => Math.random() - 0.5);
			selectedEquipment.push(...shuffled.slice(0, count));
		}

		if (selectedEquipment.length === 0 && nonExclusiveEquipment.length > 0) {
			selectedEquipment.push(
				nonExclusiveEquipment[Math.floor(Math.random() * nonExclusiveEquipment.length)],
			);
		}

		const start = new Date(bookingDate);
		start.setHours(startHour, 0, 0, 0);

		const end = new Date(bookingDate);
		if (isMultiDay) {
			end.setDate(end.getDate() + Math.floor(duration / 24) + 1);
			end.setHours(17 + Math.floor(Math.random() * 4), 0, 0, 0);
		} else {
			end.setHours(endHour, 0, 0, 0);
		}

		const noteIndex = Math.floor(Math.random() * notes.length);

		bookings.push({
			id: `booking_${i + 1}`,
			start: start.toISOString(),
			end: end.toISOString(),
			note: notes[noteIndex],
			aborted: null,
			member,
			workshop,
			equipment: selectedEquipment,
		});
	}

	return bookings.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

let mockBookings: any[] = [];

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}));
	const equipmentIds = Array.isArray(body.equipmentIds)
		? body.equipmentIds
		: (body.equipmentIds || '').split(',').filter(Boolean);
	const start = body.start;
	const end = body.end;
	const workshopId = body.workshopId;

	const [{ allEquipment }, { allWorkshops }, { allMembers }] = await Promise.all([
		apiQuery(AllEquipmentDocument, { all: true }),
		apiQuery(AllWorkshopsDocument, { all: true }),
		apiQuery(AllMembersDocument, { all: true }),
	]);

	if (mockBookings.length === 0) {
		const rangeStart = start ? new Date(start) : new Date('2026-01-01');
		const rangeEnd = end ? new Date(end) : new Date('2026-12-31');
		mockBookings = generateBookings(
			50000,
			allWorkshops,
			allEquipment,
			allMembers,
			new Date('2026-01-01'),
			new Date('2026-12-31'),
			rangeStart,
			rangeEnd,
		);
	} else if (start && end) {
		// Generate additional multi-day bookings for this specific range
		const rangeStart = new Date(start);
		const rangeEnd = new Date(end);
		const existingIds = new Set(mockBookings.map((b: any) => b.id));
		
		const newBookings = generateBookingsForRange(
			8,
			allWorkshops,
			allEquipment,
			allMembers,
			rangeStart,
			rangeEnd,
			existingIds,
		);
		mockBookings.push(...newBookings);
	}

	let bookings = mockBookings;

	if (workshopId) {
		bookings = bookings.filter((b) => b.workshop.id === workshopId);
	}

	if (start || end) {
		bookings = bookings.filter((b) => {
			const bookingStart = new Date(b.start);
			const bookingEnd = new Date(b.end);
			if (start && end) {
				const startDate = new Date(start);
				const endDate = new Date(end);
				return bookingStart < endDate && bookingEnd > startDate;
			}
			if (start) return new Date(b.end) > new Date(start);
			if (end) return new Date(b.start) < new Date(end);
			return true;
		});
	}

	if (equipmentIds.length > 0) {
		bookings = bookings.filter((b) => b.equipment.some((e: any) => equipmentIds.includes(e.id)));
	}

	return new NextResponse(JSON.stringify(bookings), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
