import 'dotenv/config';
import * as memberController from '@/lib/controllers/member';
import { generateVerificationToken } from '@/lib/controllers/utils';
import * as bookingController from '@/lib/controllers/booking';
import * as reportController from '@/lib/controllers/report';
import { z } from 'zod/v4';
import base64url from 'base64url';

function print(data: any) {
	console.log(JSON.stringify(data, null, 2));
}

export async function test() {
	console.log('test');
	console.time('test');
	const email = 'bjorn@konst-teknik.se';
	const reportId = 'dpPTLmxBR-2NGM8EObw4sA';

	//const email = 'bjorn@konst-teknik.se';
	//const email = 'mattias@konst-teknik.se';
	//const token = await generateVerificationToken(email);
	//console.log(token);
	//const member = await memberController.findByEmail(email);
	const data = await reportController.find(reportId);
	// const str = 'sdasda';
	// console.log(base64url.decode(reportId, 'base64url') === reportId);
	// const validateAndParseBase64 = z.string().min(20);
	// //.transform((str) => Buffer.from(str, 'base64url').toString());
	// console.log(validateAndParseBase64.safeParse(str));
	console.log(JSON.stringify(data, null, 2));
	// //await memberController.removeUser(member?.user as string);
	//console.log(JSON.stringify(data, null, 2));
	console.timeEnd('test');
}

test();
