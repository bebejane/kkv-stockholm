import { buildMetadata } from '@/app/layout';
import s from './page.module.scss';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';

export default async function NewBooking({ params }: PageProps<'/medlem/bokningar/ny'>) {
	const session = await getSession();

	return (
		<article>
			<h1>Ny Bokning</h1>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Ny Bokning`,
		pathname: `/medlem/bokningar/ny`,
	});
}
