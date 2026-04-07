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
import { notFound } from 'next/navigation';
import { ListSection } from '@/components/common/ListSection';

export default async function CoursesPage({ params }: PageProps<'/medlem/kurser'>) {
	return notFound();
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
			<ListSection
				title='Pågående kurser'
				empty='Du har inga pågående kurser'
				items={currentCourses.map(({ id, start, end, workshop, price, slug, _status }) => ({
					id,
					href: `/medlem/kurser/${id}`,
					columns: [
						formatDateRange(start, end, { short: true }),
						workshop?.title,
						_status === 'draft' && 'Ej godkänd',
					],
				}))}
			/>
			<ListSection
				title='Kommande kurser'
				empty='Du har inga kommande kurser'
				items={futureCourses.map(({ id, start, end, workshop, price, slug, _status }) => ({
					id,
					href: `/medlem/kurser/${id}`,
					columns: [
						formatDateRange(start, end, { short: true }),
						workshop?.title,
						formatPrice(price),
					],
				}))}
			/>
			<ListSection
				title='Föregående kurser'
				empty='Du har inte haft några kurser ännu'
				items={pastCourses.map(({ id, workshop, start, end, price, slug, _status }) => ({
					id,
					href: `/medlem/kurser/${id}`,
					columns: [
						formatDateRange(start, end, { short: true }),
						workshop?.title,
						formatPrice(price),
					],
				}))}
			/>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/kurser'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Kurser`,
		pathname: `/medlem/kurser`,
	});
}
