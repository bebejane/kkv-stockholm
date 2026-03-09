import { buildMetadata } from '@/app/(website)/layout';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import { formatDateRange } from '@/lib/dates';
import { formatPrice } from '@/lib/utils';
import { AllCoursesByMemberDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { isBefore, isAfter, startOfDay } from 'date-fns';
import Link from 'next/link';
import { Empty } from '@/components/common/Empty';

export default async function CoursesPage({ params }: PageProps<'/medlem/kurser'>) {
	const session = await getMemberSession();

	const { allCourses } = await apiQuery(AllCoursesByMemberDocument, {
		all: true,
		revalidate: 0,
		includeDrafts: true,
		variables: { memberId: session.member.id },
	});

	const now = startOfDay(new Date());
	const currentCourses = allCourses.filter(
		({ start, end }) => isAfter(now, new Date(start)) && isBefore(now, new Date(end)),
	);
	const futureCourses = allCourses.filter(({ start }) => isAfter(new Date(start), now));
	const pastCourses = allCourses.filter(({ end }) => isAfter(now, new Date(end)));

	return (
		<article>
			<h1>Dina kurser</h1>
			<Link href='/medlem/kurser/ny'>
				<Button>Ny kurs</Button>
			</Link>
			<section>
				<header className='margin-bottom'>
					<h2>Pågående kurser</h2>
				</header>
				{currentCourses.length > 0 ? (
					<ul className='list'>
						{currentCourses.map(({ id, start, end, workshop, price, slug, _status }) => (
							<li key={id}>
								<Link href={`/medlem/kurser/${id}`} className='content-grid mid'>
									<span>{formatDateRange(start, end, { short: true })}</span>
									<span>{workshop?.title}</span>
									<span>{_status === 'draft' && 'Ej godkänd'}</span>
									<span>›</span>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<Empty>Du har inga pågående kurser</Empty>
				)}
				<header className='margin-bottom'>
					<h2>Kommande kurser</h2>
				</header>
				{futureCourses.length > 0 ? (
					<ul className='list'>
						{futureCourses.map(({ id, start, end, workshop, price, slug, _status }) => (
							<li key={id}>
								<Link href={`/medlem/kurser/${id}`} className='content-grid mid'>
									<span>{formatDateRange(start, end, { short: true })}</span>
									<span>{workshop?.title}</span>
									<span>{formatPrice(price)}</span>
									<span>›</span>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<Empty>Du har inga kommande kurser</Empty>
				)}
			</section>

			<section>
				<header className='margin-bottom'>
					<h2>Föregående kurser</h2>
				</header>
				{pastCourses.length > 0 ? (
					<ul className='list'>
						{pastCourses.map(({ id, workshop, start, end, price, slug, _status }) => (
							<li key={id}>
								<Link href={`/medlem/kurser/${id}`} className='content-grid mid'>
									<span>{formatDateRange(start, end, { short: true })}</span>
									<span>{workshop?.title}</span>
									<span>{formatPrice(price)}</span>
									<span>›</span>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<Empty>Du har inte haft några kurser ännu</Empty>
				)}
			</section>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/kurser'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Kurser`,
		pathname: `/medlem/kurser`,
	});
}
