import { asc, count, eq, getTableColumns, gt, sql } from 'drizzle-orm';
import { db } from '@/db';
import { user } from '@/db/auth-schema';
import * as memberController from '@/lib/controllers/member';

async function main() {
	const user = await memberController.findUserByEmail('bjorn@konst-teknik.se');
	console.log(user);
	if (user) await memberController.removeUser(user?.id);
	//const id = '1';
	//const usr = await db.select().from(user).where(eq(user.id, id));
	//console.log(usr);
}

main();
