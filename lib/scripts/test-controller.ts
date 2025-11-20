import 'dotenv/config';
import { getMember, removeMember, updateMember, handleMemberChange, MemberStatus } from '@/lib/controller/member';
import { getUser, removeUser } from '@/lib/controller/user';

function print(data: any) {
	console.log(JSON.stringify(data, null, 2));
}

export async function test() {
	const member = await getMember('bjorn@konst-teknik.se');
	const user = await getUser('aa8223ETTWaR8nAET-cgGQ');

	console.log(member?.email, member?.member_status);
	await handleMemberChange(member?.email as string);
	//print(member);
	//print(user);
}

test();
