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

export default async function BookingReport({ params }: PageProps<'/medlem/bokningar/[booking]/rapportera'>) {
	const session = await getSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });
	if (!booking) return notFound();

	const { start, end, workshop, equipment, note, report, reported } = booking;

	return (
		<article>
			<h1>Tidigare bokning</h1>
			<p className='intro'>
				Du hade en tidigare bokning den {formatDate(start)} i {workshop?.titleLong},{' '}
				{equipment.map(({ title }) => title).join(', ')}
			</p>
			<Link href={`/medlem/rapporter/${id}`}>
				<Button variant='outline'>Rapportera</Button>
			</Link>
			<nav className='line'>
				<Link href={`/medlem/bokningar/${id}`}>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/medlem/bokningar/[booking]/rapportera'>): Promise<Metadata> {
	const { booking: id } = await params;
	return buildMetadata({
		title: `Medlem — Bokning - Rapportera`,
		pathname: `/medlem/bokningar/${id}/rapportera`,
	});
}
