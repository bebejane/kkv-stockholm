import s from './page.module.scss';
import cn from 'classnames';

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
import { WorkshopPriceSection } from '@/components/common/WorkshopPriceSection';

export default async function BookingPage({ params }: PageProps<'/medlem/bokningar/[booking]'>) {
	const session = await getMemberSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });
	if (!booking || booking.member?.id !== session.member.id) return notFound();

	const { start, end, aborted, workshop, equipment, note, report } = booking;
	const isFutureBooking = isAfter(tzDate(start as string), tzDate());

	return (
		<article>
			<h1 className={s.headline}>{metadata.title as string}</h1>

			{isFutureBooking && (
				<Link href={`/medlem/bokningar/${id}/avboka`} aria-disabled={!!aborted}>
					<Button variant='outline' disabled={!!aborted}>
						Avboka
					</Button>
				</Link>
			)}

			{aborted && (
				<p className={cn('intro', s.aborted)}>
					Denna bokning var avbokad: {formatDateTime(aborted)}
				</p>
			)}

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
			<WorkshopPriceSection workshop={workshop} fullWidth={true} />
			<nav className='line back'>
				<Link href='/medlem/bokningar'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Din bokning',
};
