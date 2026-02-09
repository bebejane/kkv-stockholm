import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { Thumbnail } from '@/components/common/Thumbnail';
import { AllCoursesDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { formatDateRange, tzDate } from '@/lib/dates';

export default async function CoursesPage({ params }: PageProps<'/kurser'>) {
	const { allCourses } = await apiQuery(AllCoursesDocument, { all: true });

	// Filter out courses that ended before today (Stockholm date).
	const nowTz = tzDate(new Date());
	const todayDateOnly = new Date(nowTz.getFullYear(), nowTz.getMonth(), nowTz.getDate());

	const courses = [...allCourses]
		.filter((c) => {
			if (!c?.end) return true;
			const endTz = tzDate(c.end);
			const endDateOnly = new Date(endTz.getFullYear(), endTz.getMonth(), endTz.getDate());
			return endDateOnly.getTime() >= todayDateOnly.getTime();
		})
		.sort((a, b) => {
			const aTime = a.start ? tzDate(a.start).getTime() : Number.POSITIVE_INFINITY;
			const bTime = b.start ? tzDate(b.start).getTime() : Number.POSITIVE_INFINITY;
			if (aTime !== bTime) return aTime - bTime;
			return (a.title ?? '').localeCompare(b.title ?? '', 'sv');
		});

	return (
		<>
			<article className={s.courses}>
				<header>
					<h1>Aktuella kurser</h1>
					<Link className='small' href='/kurser/arkiv'>
						Visa tidigare kurser
					</Link>
				</header>
				<section id='courses'>
					<ul>
						{courses.map(({ image, title, start, end, slug, id }) => (
							<li key={id}>
								<span className='caps'>{formatDateRange(start, end, { short: true })}</span>
								<a href={`/kurser/${slug}`}>
									<h4 className='big'>{title}</h4>
								</a>
								<Thumbnail image={image as FileField} href={`/kurser/${slug}`} />
							</li>
						))}
					</ul>
				</section>
			</article>
			{/* <DraftMode url={draftUrl} path={`/`} /> */}
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Kurser',
		pathname: '/kurser',
	});
}
