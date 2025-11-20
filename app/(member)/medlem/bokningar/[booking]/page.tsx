import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { BookingDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default async function Booking({ params }: PageProps<'/medlem/bokningar/[booking]'>) {
	const session = await getSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });
	if (!booking) return notFound();

	const { start, end, workshop, note, report, reported } = booking;

	return (
		<article>
			<h1>Kommande bokning</h1>
			<p className='intro'>Du har en boking den 4 september i Keramikverstaden, Ugn 4</p>
			<section>
				<ul className='meta'>
					<li>
						<span>Timme</span>
						<span>{formatPrice(workshop?.priceHour)}</span>
					</li>
					<li>
						<span>Dag</span>
						<span>{formatPrice(workshop?.priceDay)}</span>
					</li>
					<li>
						<span>Vecka</span>
						<span>{formatPrice(workshop?.priceWeek)}</span>
					</li>
					<li>
						<span>Månad</span>
						<span>{formatPrice(workshop?.priceMonth)}</span>
					</li>
					{workshop?.equipment.map(({ title, price }) => (
						<li key={title}>
							<span>{title}</span>
							<span>{price}</span>
						</li>
					))}
				</ul>
			</section>
			<Link href='/medlem/bokningar'>Tillaka</Link>
			<Button className={s.cancel}>Avboka</Button>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Bokning`,
		pathname: `/medlem/bokningar/ny`,
	});
}
