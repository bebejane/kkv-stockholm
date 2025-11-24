import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import Link from 'next/link';
import { formatDateRange, formatPrice } from '@/lib/utils';
import { AllCoursesByMemberDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { isBefore, isAfter } from 'date-fns';

export default async function CoursesPage({ params }: PageProps<'/medlem/kurser'>) {
	const session = await getMemberSession();

	const { allCourses } = await apiQuery(AllCoursesByMemberDocument, {
		all: true,
		revalidate: 0,
		variables: { memberId: session.member.id },
	});

	const today = new Date();
	const currentCourses = allCourses.filter(
		({ start, end }) => isAfter(today, new Date(start)) && isBefore(today, new Date(end))
	);
	const futureCourses = allCourses.filter(({ start }) => isAfter(new Date(start), today));
	const pastCourses = allCourses.filter(({ end }) => isBefore(new Date(end), today));

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
				<ul className='list'>
					{currentCourses.map(({ id, start, end, workshop, price, slug }) => (
						<li key={id} className='content-grid mid'>
							<Link href={`/medlem/kurser/${id}`}>
								<span>{formatDateRange(start, end)}</span>
								<span>{workshop?.title}</span>
								<span></span>
								<span>›</span>
							</Link>
						</li>
					))}
				</ul>
			</section>
			<section>
				<header className='margin-bottom'>
					<h2>Komande kurser</h2>
				</header>
				<ul className='list'>
					{futureCourses.map(({ id, start, end, workshop, price, slug }) => (
						<li key={id} className='content-grid mid'>
							<Link href={`/medlem/kurser/${id}`}>
								<span>{formatDateRange(start, end)}</span>
								<span>{workshop?.title}</span>
								<span>›</span>
							</Link>
						</li>
					))}
				</ul>
			</section>
			<section>
				<header className='margin-bottom'>
					<h2>Föregående kurser</h2>
				</header>
				<ul className='list'>
					{pastCourses.map(({ id, workshop, start, end, price, slug }) => (
						<li key={id} className='content-grid mid'>
							<Link href={`/medlem/kurser/${id}`}>
								<span>{formatDateRange(start, end)}</span>
								<span>{workshop?.title}</span>
								<span>{formatPrice(price)}</span>
								<span>›</span>
							</Link>
						</li>
					))}
				</ul>
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
