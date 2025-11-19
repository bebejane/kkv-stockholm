import { buildMetadata } from '@/app/layout';
import s from './page.module.scss';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';

export default async function Profile({ params }: PageProps<'/medlem/profil'>) {
	const session = await getSession();

	return (
		<article>
			<h1>Profil</h1>
			{session.user.email}
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/profil'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Profil`,
		pathname: `/medlem/profil`,
	});
}
