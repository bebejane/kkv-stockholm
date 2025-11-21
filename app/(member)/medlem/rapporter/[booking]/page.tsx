import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { AllWorkshopsDocument, BookingDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { isAfter, isBefore } from 'date-fns';
import { BookingReportForm } from '@/components/forms/BookingReportForm';

export default async function Booking({ params }: PageProps<'/medlem/rapporter/[booking]'>) {
	const session = await getSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });
	if (!booking) return notFound();

	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });

	console.log(booking);
	return (
		<article>
			<h1>Rapportera tid från bokning</h1>
			<BookingReportForm booking={booking} allWorkshops={allWorkshops} />
			<nav className='line'>
				<Link href='/medlem/bokningar'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/rapporter/[booking]'>): Promise<Metadata> {
	const { booking: id } = await params;
	return buildMetadata({
		title: `Medlem — Rapporter - Bokning`,
		pathname: `/medlem/rapporter/${id}`,
	});
}
