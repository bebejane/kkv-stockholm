import { auth } from '@/auth';
import { headers } from 'next/headers';

export default async function Member() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) return <h1>You are not logged in</h1>;

	return (
		<article>
			<h1>Member</h1>
		</article>
	);
}
