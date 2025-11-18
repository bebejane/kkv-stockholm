import s from './page.module.scss';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';

export default async function Profile({ params }: PageProps<'/medlem/profil'>) {
	const session = await getSession();

	return (
		<article>
			<h1>Profil</h1>
			{session.user.email}
		</article>
	);
}
