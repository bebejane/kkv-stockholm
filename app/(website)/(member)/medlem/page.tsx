import { buildMetadata } from '@/app/(website)/layout';
import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import {
	AllBookingsByMemberDocument,
	AllReportsByMemberDocument,
	FutureBookingsByMemberDocument,
} from '@/graphql';
import { formatDate, formatDateTime, tzDate } from '@/lib/dates';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { ListSection } from '@/components/common/ListSection';

export default async function BookingsPage({ params }: PageProps<'/medlem/bokningar'>) {
	const session = await getMemberSession();
	const now = tzDate().toISOString();
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
				title='Dina bokningar'
				empty='Du har inga bokningar'
				items={allBookings.map(({ id, start, end, workshop, equipment }) => ({
					id,
					href: `/medlem/bokningar/${id}`,
					columns: [
						formatDate(start, 'short'),
						workshop?.title,
						equipment.map(({ title }) => title).join(', '),
					],
				}))}
			/>
			<ListSection
				title='Bokningar som inte rapporterats klart'
				empty='Du har inga bokningar som inte rapporterats'
				items={unreportedBookings.map(({ id, start, workshop, equipment }) => ({
					id: id,
					href: `/medlem/bokningar/${id}/rapportera`,
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

export async function generateMetadata({ params }: PageProps<'/medlem'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem`,
		pathname: `/medlem`,
	});
}
