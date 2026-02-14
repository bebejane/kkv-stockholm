import s from './page.module.scss';
import cn from 'classnames';
import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { formatDate, tzDate } from '@/lib/dates';
import { AllBookingsByMemberDocument, AllReportsByMemberDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { isAfter } from 'date-fns';

export default async function ReportsPage({ params }: PageProps<'/medlem/rapporter'>) {
	const session = await getMemberSession();
	const [{ allReports }, { allBookings }] = await Promise.all([
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

	const unreportedBookings = allBookings
		.filter(({ end }) => isAfter(tzDate(new Date()), tzDate(end)))
		.filter((b) => !b.report && !allReports.find((r) => r.booking?.id === b.id));

	return (
		<article>
			<h1 className={s.headline}>Rapportera</h1>
			<Link href='/medlem/rapporter/ny'>
				<Button>Ny rapport</Button>
			</Link>
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
			<section>
				<header className='margin-bottom'>
					<h2>Rapporterat de sex senaste månaderna</h2>
				</header>
				<ul className='list'>
					{allReports.map(({ id, workshop, date, days, hours, extraCost }) => (
						<li key={id}>
							<Link className={cn('content-grid mid', s.reported)} href={`/medlem/rapporter/${id}`}>
								<span>{formatDate(date, 'short')}</span>
								<span>{workshop?.title}</span>
								<span>
									{hours}h, {days}d
								</span>
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

export async function generateMetadata({
	params,
}: PageProps<'/medlem/rapporter'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Rapporter`,
		pathname: `/medlem/rapporter`,
	});
}
