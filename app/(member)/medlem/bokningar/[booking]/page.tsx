import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { BookingDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { isAfter, isBefore } from 'date-fns';

export default async function Booking({ params }: PageProps<'/medlem/bokningar/[booking]'>) {
	const session = await getSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });
	if (!booking) return notFound();

	const { start, end, workshop, equipment, note, report, reported } = booking;

	const isPastBooking = isBefore(new Date(start), new Date());
	const isFutureBooking = isAfter(new Date(start), new Date());

	return (
		<article>
			{isFutureBooking && (
				<>
					<h1>Kommande bokning</h1>
					<Link href={`/medlem/bokningar/${id}/avboka`}>
						<Button variant='outline'>Avboka</Button>
					</Link>
					<p className='intro'>
						Du har en boking den {formatDate(start)} i {workshop?.titleLong},{' '}
						{equipment.map(({ title }) => title).join(', ')}
					</p>
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
				</>
			)}

			{isPastBooking && (
				<>
					<h1>Tidigare bokning</h1>
					<p className='intro'>
						Du hade en boking den {formatDate(start)} i {workshop?.titleLong},{' '}
						{equipment.map(({ title }) => title).join(', ')}
					</p>
					<Link href={`/medlem/rapporter/${id}`}>
						<Button variant='outline'>Rapportera</Button>
					</Link>
				</>
			)}

			<nav className='line'>
				<Link href='/medlem/bokningar'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/bokningar/[booking]'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Bokningar`,
		pathname: `/medlem/bokningar/ny`,
	});
}
