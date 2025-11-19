import { buildMetadata } from '@/app/layout';
import s from './page.module.scss';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import Link from 'next/link';
import { Metadata } from 'next';

export default async function Bookings({ params }: PageProps<'/medlem'>) {
	const session = await getSession();

	return (
		<article>
			<h1>Bokningar</h1>
			<Link href='/medlem/bokningar/ny'>
				<Button className={s.newBooking}>Ny Bokning</Button>
			</Link>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Bokningar`,
		pathname: `/medlem/bokningar`,
	});
}
