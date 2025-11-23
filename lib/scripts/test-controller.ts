import 'dotenv/config';
import * as memberController from '@/lib/controller/member';
import * as bookingController from '@/lib/controller/booking';
import * as reportController from '@/lib/controller/report';

function print(data: any) {
	console.log(JSON.stringify(data, null, 2));
}

export async function test() {
	console.time('test');
	const email = 'dev1@konst-teknik.se';

	const member = await memberController.findByEmail(email);

	console.timeEnd('test');
}

test();
