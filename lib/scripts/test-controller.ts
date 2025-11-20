import 'dotenv/config';
import { getMember, removeMember, updateMember, handleMemberChange, MemberStatus } from '@/lib/controller/member';
import { getUser, removeUser } from '@/lib/controller/user';

function print(data: any) {
	console.log(JSON.stringify(data, null, 2));
}

export async function test() {
	const email = 'dev1@konst-teknik.se';
	const member = await getMember(email);
	const user = await getUser(member?.user as string);

	console.log(member?.email, member?.member_status);
	await handleMemberChange(member?.email as string);
	//print(member);
	//print(user);
}

test();
