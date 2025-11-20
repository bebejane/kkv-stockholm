import { buildMetadata } from '@/app/layout';
import s from './page.module.scss';
import { getSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import Link from 'next/link';
import { Metadata } from 'next';
import {
	AllBookingsByMemberDocument,
	FutureBookingsByMemberDocument,
	MemberDocument,
	PastBookingsByMemberDocument,
} from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default async function Bookings({ params }: PageProps<'/medlem'>) {
	const session = await getSession();
	const { member } = await apiQuery(MemberDocument, { revalidate: 0, variables: { email: session.user.email } });
	if (!member) return notFound();

	const now = new Date().toISOString();

	const { allBookings: pastBookings } = await apiQuery(PastBookingsByMemberDocument, {
		revalidate: 0,
		all: true,
		variables: { memberId: member.id, now },
	});

	const { allBookings: futureBookings } = await apiQuery(FutureBookingsByMemberDocument, {
		revalidate: 0,
		all: true,
		variables: { memberId: member.id, now },
	});

	return (
		<article>
			<h1>Bokningar</h1>
			<section>
				<header>Dina kommande bokningar</header>
				<ul className={'list'}>
					{futureBookings.map(({ id, start, end, workshop, equipment }) => (
						<li key={id}>
							<Link href={`/medlem/bokningar/${id}`}>
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
				<header>Tidigare bokningar de sex senaste månaderna</header>
				<ul className={'list'}>
					{pastBookings.map(({ id, start, end, workshop, equipment }) => (
						<li key={id}>
							<Link href={`/medlem/bokningar/${id}`}>
								<span>{formatDate(start)}</span>
								<span>{workshop?.title}</span>
								<span>{equipment.map(({ title }) => title).join(', ')}</span>
								<span>›</span>
							</Link>
						</li>
					))}
				</ul>
			</section>
			<Link href='/medlem/bokningar/ny'>
				<Button className={s.newBooking}>Ny Bokning</Button>
			</Link>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Bokningar`,
		pathname: `/medlem/bokningar`,
	});
}
