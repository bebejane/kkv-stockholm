import { withMemberAuth } from '@/auth/utils';
import { NextRequest, NextResponse } from 'next/server';
import * as bookingController from '@/lib/controllers/booking';
import { bookingSearchSchema } from '@/lib/schemas/booking';
import { apiQuery } from 'next-dato-utils/api';
import { AllMembersDocument, AllBookableWorkshopsDocument } from '@/graphql';
import { addDays, addHours, addWeeks, setHours } from 'date-fns';

type BookingType = {
	id: string;
	start: string;
	end: string;
	note?: string | null;
	workshop: { id: string; title: string };
	equipment: Array<{ id: string; title: string; titleShort?: string | null; bookable: boolean; exclusive: boolean }>;
	member: { id: string; firstName: string; lastName: string; user?: string | null };
};

type MemberRecord = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	user?: string | null;
};

type EquipmentRecord = {
	id: string;
	title: string;
	titleShort?: string | null;
	bookable: boolean;
	exclusive: boolean;
};

type WorkshopWithEquipment = {
	id: string;
	title: string;
	equipment: EquipmentRecord[];
};

const MOCK_ID_PREFIX = 'mock-';
const YEAR = 2026;

const swedishNotes = [
	'Arbetar med projekt',
	'Förbereda utställning',
	'Privat arbete',
	'Grovarbetet klart',
	'Ska måla idag',
	'Fotografering',
	'Testa ny teknik',
	'Slutspurt',
	'Färdig imorgon',
	'Planering',
	'Skissarbete',
	'Ses imorgon',
	'Workshop',
	'Medlemsmöte',
	'Fixar grejer',
];

let cachedMembers: MemberRecord[] | null = null;
const cachedMockBookingsByWorkshop: Map<string, BookingType[]> = new Map();

function seededRandom(seed: number): () => number {
	return () => {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff;
		return seed / 0x7fffffff;
	};
}

function generateMockBookings(
	members: MemberRecord[],
	equipment: EquipmentRecord[],
	workshopId: string,
	workshopTitle: string,
	requestingUserId?: string,
): BookingType[] {
	const bookings: BookingType[] = [];
	const totalBookings = 2000;
	const random = seededRandom(workshopId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));

	const weeks2to5 = Math.floor(totalBookings * 0.01);
	const days1to2 = Math.floor(totalBookings * 0.02);
	const userBookings = Math.floor(totalBookings * 0.01);
	const shortBookings = totalBookings - weeks2to5 - days1to2 - userBookings;

	const categories = [
		{ count: weeks2to5, duration: 'weeks' },
		{ count: days1to2, duration: 'days' },
		{ count: userBookings, duration: 'user' },
		{ count: shortBookings, duration: 'short' },
	];

	let index = 0;
	for (const cat of categories) {
		for (let i = 0; i < cat.count; i++) {
			let member: MemberRecord;
			if (cat.duration === 'user' && requestingUserId) {
				const userMember = members.find((m) => m.id === requestingUserId);
				member = userMember ?? members[Math.floor(random() * members.length)];
			} else {
				member = members[Math.floor(random() * members.length)];
			}

			const month = Math.floor(random() * 12) + 1;
			const day = Math.floor(random() * 28) + 1;
			const hour = Math.floor(random() * 16) + 7;
			const start = new Date(YEAR, month - 1, day, hour, 0);

			let end: Date;
			switch (cat.duration) {
				case 'weeks':
					end = addWeeks(start, Math.floor(random() * 4) + 2);
					end = setHours(end, Math.floor(random() * 8) + 14);
					break;
				case 'days':
					end = addDays(start, Math.floor(random() * 2) + 1);
					end = setHours(end, Math.floor(random() * 10) + 13);
					break;
				case 'user':
					end = addDays(start, Math.floor(random() * 3) + 3);
					end = setHours(end, Math.floor(random() * 10) + 13);
					break;
				default:
					end = addHours(start, Math.floor(random() * 4) + 1);
					if (end.getHours() < 7) {
						end = setHours(end, 23);
					}
			}

			const rand = random() * 100;
			let equipmentCount: number;
			if (rand < 5) {
				equipmentCount = 3;
			} else if (rand < 15) {
				equipmentCount = 2;
			} else {
				equipmentCount = 1;
			}
			const selectedEquipment: EquipmentRecord[] = [];
			const usedIndices = new Set<number>();

			while (selectedEquipment.length < equipmentCount && selectedEquipment.length < equipment.length) {
				const idx = Math.floor(random() * equipment.length);
				if (!usedIndices.has(idx)) {
					usedIndices.add(idx);
					selectedEquipment.push(equipment[idx]);
				}
			}

			const note = random() < 0.3 ? swedishNotes[Math.floor(random() * swedishNotes.length)] : null;

			bookings.push({
				id: `${MOCK_ID_PREFIX}${index}`,
				start: start.toISOString(),
				end: end.toISOString(),
				note,
				workshop: { id: workshopId, title: workshopTitle },
				equipment: selectedEquipment.map((eq) => ({
					id: eq.id,
					title: eq.title,
					titleShort: eq.titleShort,
					bookable: eq.bookable,
					exclusive: eq.exclusive,
				})),
				member: {
					id: member.id,
					firstName: member.firstName,
					lastName: member.lastName,
					user: member.user,
				},
			});
			index++;
		}
	}

	return bookings;
}

async function getMembers(): Promise<MemberRecord[]> {
	if (cachedMembers) return cachedMembers;
	try {
		const { allMembers } = await apiQuery(AllMembersDocument, {
			all: true,
			revalidate: 0,
		});
		cachedMembers = allMembers as unknown as MemberRecord[];
		return cachedMembers!;
	} catch (e) {
		console.error('Failed to fetch members:', e);
		return [];
	}
}

async function getWorkshopsWithEquipment(): Promise<WorkshopWithEquipment[]> {
	try {
		const { allWorkshops } = await apiQuery(AllBookableWorkshopsDocument, {
			all: true,
			revalidate: 0,
		});
		return allWorkshops as unknown as WorkshopWithEquipment[];
	} catch (e) {
		console.error('Failed to fetch workshops:', e);
		return [];
	}
}

export async function POST(req: NextRequest, ctx: RouteContext<'/api/member/booking/search/mock'>) {
	return withMemberAuth(req, async (req, session) => {
		try {
			const body = await req.json();
			const { equipmentIds, start, end, workshopId, mode } = bookingSearchSchema.parse(body);

			const realBookings = (await bookingController.search(
				{ equipmentIds, start, end, workshopId },
				session.user.id,
				mode,
			)) as BookingType[];

			const members = await getMembers();
			const workshops = await getWorkshopsWithEquipment();
			const workshop = workshops.find((w) => w.id === workshopId);
			const workshopEquipment = workshop?.equipment.filter((e) => e.bookable) ?? [];

			const requestingMember = members.find((m) => m.user === session.user.id) ?? null;

			if (workshopEquipment.length === 0) {
				return new NextResponse(JSON.stringify(realBookings), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			if (!cachedMockBookingsByWorkshop.has(workshopId)) {
				cachedMockBookingsByWorkshop.set(
					workshopId,
					generateMockBookings(
						members,
						workshopEquipment,
						workshopId,
						workshop?.title ?? 'Mock Workshop',
						requestingMember?.id,
					),
				);
			}
			const cachedMockBookings = cachedMockBookingsByWorkshop.get(workshopId)!;

			const rangeStart = new Date(start);
			const rangeEnd = new Date(end);

			const filteredMockBookings = cachedMockBookings.filter((mock) => {
				const mockStart = new Date(mock.start);
				const mockEnd = new Date(mock.end);
				return mockStart < rangeEnd && mockEnd > rangeStart;
			});

			const equipmentToUse =
				equipmentIds && equipmentIds.length > 0
					? workshopEquipment.filter((e) => equipmentIds.includes(e.id))
					: workshopEquipment;

			const equipmentIdsToUse = new Set(equipmentToUse.map((e) => e.id));

			const filteredByEquipment = filteredMockBookings.filter((mock) =>
				mock.equipment.some((eq) => equipmentIdsToUse.has(eq.id)),
			);

			const mergedBookings = [...filteredByEquipment, ...realBookings];

			mergedBookings.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

			return new NextResponse(JSON.stringify(mergedBookings), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (e) {
			console.log(e);
			const statusText = e instanceof Error ? e.message : (e as string);
			return new NextResponse('error', { status: 500, statusText });
		}
	});
}