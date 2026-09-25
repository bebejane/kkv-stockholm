import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { BookingDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { formatBookingDate, formatDate, formatDateTime } from '@/lib/dates';
import Link from 'next/link';
import AbortButton from './AbortButton';

export default async function BookingAbortPage({
	params,
}: PageProps<'/medlem/bokningar/[booking]/avboka'>) {
	const session = await getMemberSession();
	const { booking: id } = await params;
	const { booking } = await apiQuery(BookingDocument, { revalidate: 0, variables: { id } });

	if (!booking || booking.member?.id !== session.member.id) return notFound();
	const { start, end, aborted, workshop, equipment, note, report } = booking;

	return (
		<article>
			<h1>{metadata.title as string}</h1>
			{!aborted ? (
				<>
					<p className='intro'>
						Vill du avboka din bokning den {formatBookingDate(booking)} i {workshop?.titleLong},{' '}
						{equipment.map(({ title }) => title).join(', ')}?
					</p>
					<AbortButton id={id} />
				</>
			) : (
				<p className='intro'>
					Din bokning den {formatBookingDate(booking)} i {workshop?.titleLong},
					{equipment.map(({ title }) => title).join(', ')} var aavbokad {formatDateTime(aborted)}.
				</p>
			)}
			<nav className='line back'>
				<Link href={`/medlem/bokningar/${id}`}>Tillbaka</Link>
			</nav>
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Avboka bokning',
};
