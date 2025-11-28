import 'dotenv/config';
import * as memberController from '@/lib/controllers/member';
import * as bookingController from '@/lib/controllers/booking';
import * as reportController from '@/lib/controllers/report';
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

async function test() {
	tesUuid();
	//await testMember();
	//await testBooking();
}

test();
