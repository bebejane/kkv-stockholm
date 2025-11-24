import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { isAfter, isBefore } from 'date-fns';
import { apiQuery } from 'next-dato-utils/api';
import { BookingDocument } from '@/graphql';

export default async function BookingPage({ params }: PageProps<'/medlem/bokningar/[booking]'>) {
	const session = await getMemberSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });
	if (!booking) return notFound();

	const { start, end, workshop, equipment, note, report } = booking;
	const isFutureBooking = isAfter(new Date(start as string), new Date());

	return (
		<article>
			{isFutureBooking ? (
				<>
					<h1>Kommande bokning</h1>
					<Link href={`/medlem/bokningar/${id}/avboka`}>
						<Button variant='outline'>Avboka</Button>
					</Link>
					<p className='intro'>
						Du har en boking den {formatDate(start)} i {booking.workshop?.titleLong},{' '}
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

							{//@ts-ignore
							workshop?.equipment?.map(({ title, price }) => (
								<li key={title}>
									<span>{title}</span>
									<span>{price}</span>
								</li>
							))}
						</ul>
					</section>
				</>
			) : (
				<>
					<h1>Tidigare bokning</h1>
					<p className='intro'>
						Du hade en boking den {formatDate(start)} i {workshop?.titleLong},{' '}
						{equipment.map(({ title }) => title).join(', ')}
					</p>
					<Link href={report ? `/medlem/rapporter/${report.id}` : `/medlem/bokningar/${id}/rapportera`}>
						<Button variant='outline'>Rapportera</Button>
					</Link>
				</>
			)}
			<nav className='line back'>
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
