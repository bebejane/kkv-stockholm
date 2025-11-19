import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';

export default async function Reports({ params }: PageProps<'/medlem/rapporter'>) {
	const session = await getSession();

	return (
		<article>
			<h1>Rapporter</h1>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/rapporter'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Rapporter`,
		pathname: `/medlem/rapporter`,
	});
}
