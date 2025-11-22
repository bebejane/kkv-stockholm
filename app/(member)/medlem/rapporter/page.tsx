import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import * as reportController from '@/lib/controller/report';
import * as bookingController from '@/lib/controller/booking';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/lib/utils';

export default async function Reports({ params }: PageProps<'/medlem/rapporter'>) {
	const session = await getMemberSession();
	const reports = await reportController.findByMember(session.member.id);
	const bookings = await bookingController.findAll();
	const unreported_bookings = bookings.filter((booking) => !reports.find((report) => report.booking.id === booking.id));

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
					{unreported_bookings.map(({ id, start, end, workshop, equipment }) => (
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
					{reports.map(({ id, workshop, booking, days, hours, extra_cost }) => (
						<li key={id}>
							<Link href={`/medlem/rapporter/${id}`}>
								<span>{formatDate(booking?.start)}</span>
								<span>{workshop?.title}</span>
								<span>{hours}h</span>
								<span>{days}d</span>
								<span>{formatPrice(extra_cost)}</span>
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
