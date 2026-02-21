import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import {
	AllBookingsByMemberDocument,
	AllReportsByMemberDocument,
	FutureBookingsByMemberDocument,
	PastBookingsByMemberDocument,
} from '@/graphql';
import { formatDate, formatDateTime } from '@/lib/dates';
import Link from 'next/link';
import { Button } from '@mantine/core';

export default async function BookingsPage({ params }: PageProps<'/medlem/bokningar'>) {
	const session = await getMemberSession();
	const now = new Date().toISOString();
	const [{ allBookings: futureBookings }, { allReports }, { allBookings }] = await Promise.all([
		apiQuery(FutureBookingsByMemberDocument, {
			all: true,
			revalidate: 0,
			variables: { memberId: session.member.id, now },
		}),
		apiQuery(AllReportsByMemberDocument, {
			revalidate: 0,
			all: true,
			variables: { memberId: session.member.id },
		}),
		apiQuery(AllBookingsByMemberDocument, {
			revalidate: 0,
			all: true,
			variables: { memberId: session.member.id },
		}),
	]);

	const unreportedBookings = allBookings.filter(
		(booking) => !allReports.find((report) => report.booking?.id === booking.id),
	);

	return (
		<article>
			<h1>Medlem</h1>
			<Link href='/medlem/bokningar/ny'>
				<Button>Ny bokning</Button>
			</Link>
			<section>
				<header className='margin-bottom'>
					<h2>Dina kommande bokningar</h2>
				</header>
				<ul className='list'>
					{futureBookings.map(({ id, start, end, workshop, equipment }) => (
						<li key={id}>
							<Link href={`/medlem/bokningar/${id}`} className='content-grid mid'>
								<span>{formatDateTime(start, 'short')}</span>
								<span>{workshop?.title}</span>
								<span>{equipment.map(({ title }) => title).join(', ')}</span>
								<span>›</span>
							</Link>
						</li>
					))}
				</ul>
			</section>
			<section>
				<header className='margin-bottom'>
					<h2>Bokningar som inte rapporterats klart</h2>
				</header>
				<ul className='list'>
					{unreportedBookings.map(({ id, start, workshop, equipment }) => (
						<li key={id}>
							<Link className='content-grid mid' href={`/medlem/bokningar/${id}/rapportera`}>
								<span>{formatDate(start, 'short')}</span>
								<span>{workshop?.title}</span>
								<span>{equipment.map(({ title }) => title).join(', ')}</span>
								<span>›</span>
							</Link>
						</li>
					))}
				</ul>
			</section>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem`,
		pathname: `/medlem`,
	});
}
