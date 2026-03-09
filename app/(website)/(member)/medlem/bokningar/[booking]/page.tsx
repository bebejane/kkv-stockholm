import s from './page.module.scss';
import cn from 'classnames';
import { buildMetadata } from '@/app/(website)/layout';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDateTime, formatBookingDate, tzDate } from '@/lib/dates';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { isAfter } from 'date-fns';
import { apiQuery } from 'next-dato-utils/api';
import { BookingDocument } from '@/graphql';
import React from 'react';

export default async function BookingPage({ params }: PageProps<'/medlem/bokningar/[booking]'>) {
	const session = await getMemberSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });
	if (!booking) return notFound();

	const { start, end, aborted, workshop, equipment, note, report } = booking;
	const isFutureBooking = isAfter(tzDate(start as string), tzDate());

	return (
		<article>
			<h1 className={s.headline}>Din bokning</h1>

			{isFutureBooking && (
				<Link href={`/medlem/bokningar/${id}/avboka`} aria-disabled={!!aborted}>
					<Button variant='outline' disabled={!!aborted}>
						Avboka
					</Button>
				</Link>
			)}

			{aborted && <p className={s.aborted}>Denna bokning var avbokad: {formatDateTime(aborted)}</p>}

			<section className={cn(s.summary, 'intro content-grid margin-right')}>
				<div>
					<span className='small'>Från</span>
					<p>{formatDateTime(start)}</p>
				</div>
				<div>
					<span className='small'>Till</span>
					<p>{formatDateTime(end)}</p>
				</div>

				<div>
					<span className='small'>Verkstad</span>
					<p>{booking.workshop?.titleLong}</p>
				</div>

				<div>
					<span className='small'>Utrustning</span>
					<p>{equipment.map(({ title }) => title).join(', ')}</p>
				</div>

				{note && (
					<div>
						<span className='small'>Meddelande</span>
						<p>{note}</p>
					</div>
				)}
			</section>

			<section>
				<div className={cn('mid content-grid', s.meta)}>
					<h2>Priser</h2>
					<span className={s.label}>Timme</span>
					<span className={s.value}>{formatPrice(workshop?.priceHour)}</span>
					<span className={s.label}>Dag</span>
					<span className={s.value}>{formatPrice(workshop?.priceDay)}</span>
					<span className={s.label}>Vecka</span>
					<span className={s.value}>{formatPrice(workshop?.priceWeek)}</span>
					<span className={s.label}>Månad</span>
					<span className={s.value}>{formatPrice(workshop?.priceMonth)}</span>

					{workshop?.equipment
						?.filter(({ price }) => price)
						.map(({ title, price }) => (
							<React.Fragment key={title}>
								<span className={s.label}>{title}</span>
								<span className={s.long}>{price}</span>
							</React.Fragment>
						))}
				</div>
			</section>

			<nav className='line back'>
				<Link href='/medlem/bokningar'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/medlem/bokningar/[booking]'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Bokningar`,
		pathname: `/medlem/bokningar/ny`,
	});
}
