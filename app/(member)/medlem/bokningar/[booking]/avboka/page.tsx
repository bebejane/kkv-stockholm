import { buildMetadata } from '@/app/(website)/layout';
import { getUserSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { BookingDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default async function BookingCancelPage({ params }: PageProps<'/medlem/bokningar/[booking]/avboka'>) {
	const session = await getUserSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });

	if (!booking) return notFound();
	const { start, end, workshop, equipment, note, report, reported } = booking;

	return (
		<article>
			<h1>Kommande bokning</h1>
			<p className='intro'>
				Du har en boking den {formatDate(start)} i {workshop?.titleLong},{' '}
				{equipment.map(({ title }) => title).join(', ')}
			</p>
			<Button>Avboka</Button>
			<nav className='line back'>
				<Link href={`/medlem/bokningar/${id}`}>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/bokningar/[booking]/avboka'>): Promise<Metadata> {
	const { booking: id } = await params;
	return buildMetadata({
		title: `Medlem — Bokning - Avboka`,
		pathname: `/medlem/bokningar/${id}/avboka`,
	});
}
