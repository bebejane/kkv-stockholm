import 'dotenv/config';
import * as memberController from '@/lib/controllers/member';
import * as bookingController from '@/lib/controllers/booking';
import * as reportController from '@/lib/controllers/report';
import { AllBookingsSearchDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { z } from '@/lib/schemas/base';

function print(data: any) {
	console.log(JSON.stringify(data, null, 2));
}

z;

function tesUuid() {
	const uuid = z.base64url();
	const id = 'fuJERExcROKfCPhYI-IIbQ';
	console.log(uuid.safeParse(id));
}

async function testBooking() {
	const id = 'WoySkXl8Qs6-b2EOurVI8g';
	console.time('test:booking');
	const booking = await bookingController.find(id);
	print(booking);
	console.timeEnd('test:booking');
}

export async function testMember() {
	const email = 'bjorn@konst-teknik.se';
	const id = 'V-iwjig-QwWjGilWDF5FxQ';
	console.time('test:member');
	const member = await memberController.find(id);
	//print(member);
	console.timeEnd('test:member');
}
export async function testSearch() {
	const data = {
		range: ['2026-02-04T00:00:00.000Z', '2026-02-05T23:59:59.999Z'],
		workshopId: 'ffJXXXRwQ7ivaukKoSrJkg',
		equipmentIds: ['TuknMA0uSLiiC2U8CWssbQ'],
	};

	const { allBookings } = await apiQuery(AllBookingsSearchDocument, {
		variables: {
			start: data.range[0],
			end: data.range[1],
			workshopId: data.workshopId,
			equipmentIds: data.equipmentIds,
		},
	});
	console.log(allBookings);
}

async function test() {
	testSearch();
	//tesUuid();
	//await testMember();
	//await testBooking();
}

test();
