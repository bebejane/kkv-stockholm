import 'dotenv/config';
import * as memberController from '@/lib/controllers/member';
import { generateVerificationToken } from '@/lib/controllers/utils';
import * as bookingController from '@/lib/controllers/booking';
import * as reportController from '@/lib/controllers/report';

function print(data: any) {
	console.log(JSON.stringify(data, null, 2));
}

export async function test() {
	console.time('test');
	//const email = 'bjorn@konst-teknik.se';
	const email = 'mattias@konst-teknik.se';
	const token = await generateVerificationToken(email);
	console.log(token);
	//const member = await memberController.findByEmail(email);

	//await memberController.removeUser(member?.user as string);
	console.timeEnd('test');
}

test();
