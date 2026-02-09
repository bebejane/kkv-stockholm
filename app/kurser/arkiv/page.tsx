import s from '../page.module.scss';
import { buildMetadata } from '@/app/layout';
import { Thumbnail } from '@/components/common/Thumbnail';
import { AllCoursesDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import Link from 'next/link';
import { Metadata } from 'next';
import { formatDateRange, tzDate } from '@/lib/dates';

export default async function ArchivePage({ params }: PageProps<'/kurser/arkiv'>) {
	const { allCourses } = await apiQuery(AllCoursesDocument, { all: true });

	// Filter courses that ended before today (Stockholm date).
	const nowTz = tzDate(new Date());
	const todayDateOnly = new Date(nowTz.getFullYear(), nowTz.getMonth(), nowTz.getDate());

	const courses = [...allCourses]
		.filter((c) => {
			if (!c?.end) return false; // Only show courses with an end date
			const endTz = tzDate(c.end);
			const endDateOnly = new Date(endTz.getFullYear(), endTz.getMonth(), endTz.getDate());
			return endDateOnly.getTime() < todayDateOnly.getTime();
		})
		.sort((a, b) => {
			// Sort by end date descending (newest first)
			const aTime = a.end ? tzDate(a.end).getTime() : 0;
			const bTime = b.end ? tzDate(b.end).getTime() : 0;
			if (aTime !== bTime) return bTime - aTime;
			return (a.title ?? '').localeCompare(b.title ?? '', 'sv');
		});

	return (
		<>
			<article className={s.courses}>
				<header>
					<h1>Tidigare kurser</h1>
					<Link className='small' href='/kurser'>
						Visa aktuella kurser
					</Link>
				</header>
				<section id='courses'>
					{courses.length === 0 ? (
						<p>Inga avslutade kurser hittades.</p>
					) : (
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
					)}
				</section>
			</article>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return buildMetadata({
		title: 'Kursarkiv',
		pathname: '/kurser/arkiv',
	});
}
