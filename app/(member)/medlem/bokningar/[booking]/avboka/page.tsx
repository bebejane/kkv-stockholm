import { buildMetadata } from '@/app/layout';
import { getUserSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { BookingDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/dates';
import Link from 'next/link';
import CancelButton from './CancelButton';

export default async function BookingCancelPage({
	params,
}: PageProps<'/medlem/bokningar/[booking]/avboka'>) {
	const session = await getUserSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });

	if (!booking) return notFound();
	const { start, end, workshop, equipment, note, report } = booking;

	return (
		<article>
			<h1>Avboka bokning</h1>
			<p className='intro'>
				Vill du avboka din bokning den {formatDate(start)} i {workshop?.titleLong},{' '}
				{equipment.map(({ title }) => title).join(', ')}?
			</p>
			<CancelButton id={id} />
			<nav className='line back'>
				<Link href={`/medlem/bokningar/${id}`}>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/medlem/bokningar/[booking]/avboka'>): Promise<Metadata> {
	const { booking: id } = await params;
	return buildMetadata({
		title: `Medlem — Bokning - Avboka`,
		pathname: `/medlem/bokningar/${id}/avboka`,
	});
}
