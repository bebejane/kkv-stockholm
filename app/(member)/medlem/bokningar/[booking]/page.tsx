import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { isAfter, isBefore } from 'date-fns';
import * as bookingController from '@/lib/controller/booking';
import * as reportController from '@/lib/controller/report';

export default async function Booking({ params }: PageProps<'/medlem/bokningar/[booking]'>) {
	const session = await getMemberSession();
	const { booking: id } = await params;
	const booking = await bookingController.find(id);
	if (!booking) return notFound();

	const report = await reportController.findByBookingId(booking.id);
	const { start, end, workshop, equipment, note } = booking;
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
						Du har en boking den {formatDate(start)} i {workshop?.title_long},{' '}
						{equipment.map(({ title }) => title).join(', ')}
					</p>
					<section>
						<ul className='meta'>
							<li>
								<span>Timme</span>
								<span>{formatPrice(workshop?.price_hour)}</span>
							</li>
							<li>
								<span>Dag</span>
								<span>{formatPrice(workshop?.price_day)}</span>
							</li>
							<li>
								<span>Vecka</span>
								<span>{formatPrice(workshop?.price_week)}</span>
							</li>
							<li>
								<span>Månad</span>
								<span>{formatPrice(workshop?.price_month)}</span>
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
						Du hade en boking den {formatDate(start)} i {workshop?.title_long},{' '}
						{equipment.map(({ title }) => title).join(', ')}
					</p>
					<Link href={report ? `/medlem/rapporter/${report.id}` : `/medlem/bokningar/${id}/rapportera`}>
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
