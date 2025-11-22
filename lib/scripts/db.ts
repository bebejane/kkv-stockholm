import { asc, count, eq, getTableColumns, gt, sql } from 'drizzle-orm';
import { db } from '@/db';
import { user } from '@/db/auth-schema';
import * as userController from '@/lib/controller/user';

async function main() {
	const user = await userController.findByEmail('bjorn@konst-teknik.se');
	console.log(user);
	if (user) await userController.remove(user?.id);
	//const id = '1';
	//const usr = await db.select().from(user).where(eq(user.id, id));
	//console.log(usr);
}

main();
