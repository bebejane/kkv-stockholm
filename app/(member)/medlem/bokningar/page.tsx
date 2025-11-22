import { buildMetadata } from '@/app/layout';
import s from './page.module.scss';
import { getMemberSession, getUserSession } from '@/auth/utils';
import * as bookingController from '@/lib/controller/booking';
import { Button } from '@mantine/core';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import cn from 'classnames';

export default async function Bookings({ params }: PageProps<'/medlem'>) {
	const session = await getMemberSession();
	if (!session) return notFound();

	const future_bookings = await bookingController.findFuture();
	const past_bookings = await bookingController.findPast();

	return (
		<article>
			<h1>Bokningar</h1>
			<Link href='/medlem/bokningar/ny'>
				<Button className={cn(s.newBooking)}>Ny Bokning</Button>
			</Link>
			<section>
				<header className='line margin-bottom'>
					<h2>Dina kommande bokningar</h2>
				</header>
				<ul className='list'>
					{future_bookings.map(({ id, start, end, workshop, equipment }) => (
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
				<header className='line margin-bottom'>
					<h2>Tidigare bokningar de 6 senaste månaderna</h2>
				</header>
				<ul className='list'>
					{past_bookings.map(({ id, start, end, workshop, equipment }) => (
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
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/bokningar'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Bokningar`,
		pathname: `/medlem/bokningar`,
	});
}
