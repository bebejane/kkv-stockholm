import s from './page.module.scss';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { formatDate, formatDateTime } from '@/lib/dates';
import { apiQuery } from 'next-dato-utils/api';
import {
	BookingHelpDocument,
	FutureBookingsByMemberDocument,
	PastBookingsByMemberDocument,
} from '@/graphql';
import Link from 'next/link';
import { ListSection } from '@/components/common/ListSection';
import Content from '@/components/content/Content';

export default async function BookingsPage({ params }: PageProps<'/medlem/bokningar'>) {
	const session = await getMemberSession();
	const now = new Date().toISOString();
	const [{ allBookings: pastBookings }, { allBookings: futureBookings }, { bookingHelp }] =
		await Promise.all([
			apiQuery(PastBookingsByMemberDocument, {
				all: true,
				revalidate: 0,
				variables: { memberId: session.member.id, now },
			}),
			apiQuery(FutureBookingsByMemberDocument, {
				all: true,
				revalidate: 0,
				variables: { memberId: session.member.id, now },
			}),
			apiQuery(BookingHelpDocument, {
				revalidate: 0,
			}),
		]);

	return (
		<article>
			<h1 className={s.headline}>{metadata.title as string}</h1>
			<Link href='/medlem/bokningar/ny'>
				<Button>Ny bokning</Button>
			</Link>
			<section className='margin-bottom margin-right'>
				<Content content={bookingHelp?.bookingOverview} />
			</section>
			<ListSection
				title='Dina kommande bokningar'
				empty='Du har inga kommande bokningar'
				items={futureBookings.map(({ id, start, end, workshop, equipment }) => ({
					id,
					href: `/medlem/bokningar/${id}`,
					columns: [
						formatDateTime(start, 'short'),
						workshop?.title,
						equipment.map(({ title }) => title).join(', '),
					],
				}))}
			/>
			<ListSection
				title='Tidigare bokningar de 6 senaste månaderna'
				empty='Du har inga tidigare bokningar'
				items={pastBookings.map(({ id, start, end, workshop, equipment }) => ({
					id,
					href: `/medlem/bokningar/${id}`,
					columns: [
						formatDate(start, 'short'),
						workshop?.title,
						equipment.map(({ title }) => title).join(', '),
					],
				}))}
			/>
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Bokningar',
};
