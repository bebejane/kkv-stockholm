import { buildMetadata } from '@/app/(website)/layout';
import s from './page.module.scss';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import Link from 'next/link';
import { Metadata } from 'next';
import { formatDate } from '@/lib/utils';
import cn from 'classnames';
import { apiQuery } from 'next-dato-utils/api';
import { FutureBookingsByMemberDocument, PastBookingsByMemberDocument } from '@/graphql';

export default async function BookingsPage({ params }: PageProps<'/medlem/bokningar'>) {
	const session = await getMemberSession();
	const now = new Date().toISOString();
	const [{ allBookings: pastBookings }, { allBookings: futureBookings }] = await Promise.all([
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
	]);

	return (
		<article>
			<h1>Bokningar</h1>
			<Link href='/medlem/bokningar/ny'>
				<Button className={cn(s.newBooking)}>Ny Bokning</Button>
			</Link>
			<section>
				<header className='margin-bottom'>
					<h2>Dina kommande bokningar</h2>
				</header>
				<ul className='list'>
					{futureBookings.map(({ id, start, end, workshop, equipment }) => (
						<li key={id} className='content-grid'>
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
				<header className=' margin-bottom'>
					<h2>Tidigare bokningar de 6 senaste månaderna</h2>
				</header>
				<ul className='list'>
					{pastBookings.map(({ id, start, end, workshop, equipment }) => (
						<li key={id}>
							<Link className='content-grid' href={`/medlem/bokningar/${id}`}>
								<span>{formatDate(start)}</span>
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

export async function generateMetadata({ params }: PageProps<'/medlem/bokningar'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Bokningar`,
		pathname: `/medlem/bokningar`,
	});
}
