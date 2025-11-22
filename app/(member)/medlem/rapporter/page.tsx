import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/lib/utils';
import { AllBookingsByMemberDocument, AllReportsByMemberDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';

export default async function Reports({ params }: PageProps<'/medlem/rapporter'>) {
	const session = await getMemberSession();

	const [{ allReports }, { allBookings }] = await Promise.all([
		apiQuery(AllReportsByMemberDocument, { all: true, variables: { memberId: session.member.id } }),
		apiQuery(AllBookingsByMemberDocument, { all: true, variables: { memberId: session.member.id } }),
	]);
	//const reports = await reportController.findByMember(session.member.id);
	//const bookings = await bookingController.findAll();
	const unreportedBookings = allBookings.filter(
		(booking) => !allReports.find((report) => report.booking?.id === booking.id)
	);

	return (
		<article>
			<h1>Rapportera tid & kostnader</h1>
			<Link href='/medlem/bokningar/ny'>
				<Button>Boka</Button>
			</Link>
			<section>
				<header className='line margin-bottom'>
					<h2>Bokningar som inte rapporterats klart</h2>
				</header>
				<ul className='list'>
					{unreportedBookings.map(({ id, start, end, workshop, equipment }) => (
						<li key={id}>
							<Link href={`/medlem/bokningar/${id}/rapportera`}>
								<span>{formatDate(start)}</span>
								<span>{workshop?.title}</span>
								<span>{equipment.map(({ title }) => title).join(', ')}</span>
								<span>›</span>
							</Link>
						</li>
					))}
				</ul>
			</section>
			<section>
				<header className='line margin-bottom'>
					<h2>Rapporterat de sex senaste månaderna</h2>
				</header>
				<ul className='list'>
					{allReports.map(({ id, workshop, booking, days, hours, extraCost }) => (
						<li key={id}>
							<Link href={`/medlem/rapporter/${id}`}>
								<span>{formatDate(booking?.start)}</span>
								<span>{workshop?.title}</span>
								<span>{hours}h</span>
								<span>{days}d</span>
								<span>{formatPrice(extraCost)}</span>
								<span>›</span>
							</Link>
						</li>
					))}
				</ul>
			</section>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/rapporter'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Rapporter`,
		pathname: `/medlem/rapporter`,
	});
}
