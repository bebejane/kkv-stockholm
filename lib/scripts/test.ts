import 'dotenv/config';
import * as memberController from '@/lib/controller/member';
import * as bookingController from '@/lib/controller/booking';
import * as reportController from '@/lib/controller/report';

function print(data: any) {
	console.log(JSON.stringify(data, null, 2));
}

async function test() {
	await testMember();
	await testBooking();
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

test();
