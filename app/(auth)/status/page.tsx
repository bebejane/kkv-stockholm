import { auth } from '@/auth';
import { headers } from 'next/headers';

export default async function Member() {
	const session = await auth.api.getSession({ headers: await headers() });
	return (
		<article>
			<h1>{session ? 'You are logged in' : 'You are not logged in'}</h1>
		</article>
	);
}
