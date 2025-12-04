import Content from '@/components/content/Content';
import s from './page.module.scss';
import { AllCoursesDocument, CourseDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { Image } from 'react-datocms';
import { formatDate, formatTimeRange } from '@/lib/dates';
import { SignUpToCourseForm } from '@/components/forms/SignUpToCourseForm';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';
import cn from 'classnames';
import Link from 'next/link';

export default async function CoursePage({ params }: PageProps<'/kurser/[course]'>) {
	const { course: slug } = await params;
	const { course, draftUrl } = await apiQuery(CourseDocument, { variables: { slug } });

	if (!course) return notFound();

	const { intro, about, targetGroup, goal, aboutOrganizer, organizerLink, image, member, price, start, end, workshop, language } = course;

	return (
		<>
			<article>
				<h1>{course.title}</h1>
				<section className={'margin-right margin-bottom intro'}>
					<Content content={intro} />
					<figure className={s.image}>{image?.responsiveImage && <Image data={image.responsiveImage} />}</figure>
				</section>
				<section className={'margin-right margin-bottom content'}>
					<h2>Om kursen</h2>
					<Content content={about} />
				</section>
				<section className={'margin-right margin-bottom content'}>
					<h2>Målgrupp</h2>
					<Content content={targetGroup} />
				</section>
				<section className={'margin-right margin-bottom content'}>
					<h2>Kursens mål</h2>
					<Content content={goal} />
				</section>
				<section className={'margin-right margin-bottom content'}>
					<h2>Om kursledaren</h2>
					<Content content={aboutOrganizer} />
					{organizerLink && (
						<p>
							<a href={organizerLink}>Läs mer</a>
						</p>
					)}
				</section>
				<section className={cn('line margin-bottom', s.summary)}>
					<header>
						<h2>Summering</h2>
					</header>
					<div className={cn(s.meta)}>
						<ul className='meta mid content-grid'>
							<li>
								<span>Datum</span> <span>{formatDate(start)}</span>
							</li>
							<li>
								<span>Tid</span> <span>{formatTimeRange(start, end)}</span>
							</li>
							<li>
								<span>Plats</span> <span>{workshop?.title || ''}</span>
							</li>
							<li>
								<span>Antal deltagare</span> <span>8</span>
							</li>
							<li>
								<span>Kursledare</span>{' '}
								<span>
									{member.firstName} {member.lastName}
								</span>
							</li>
							<li>
								<span>Pris</span> <span>{price} kr (inkl moms)</span>
							</li>
							<li>
								<span>Språk</span> <span>{language}</span>
							</li>

						</ul>
					</div>
				</section>
				<section className={cn('line margin-bottom', s.apply)}>
					<header>
						<h2>Anmälan</h2>
						<SignUpToCourseForm courseId={course.id} />
					</header>
				</section>
				<nav className='line back'>
					<Link href={`/kurser`}>Tillbaka</Link>
				</nav>
			</article>
			<DraftMode url={draftUrl} path={`/kurser/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allCourses } = await apiQuery(AllCoursesDocument, { all: true });
	return allCourses.map(({ slug }) => ({ course: slug }));
}

export async function generateMetadata({ params }: PageProps<'/kurser/[course]'>): Promise<Metadata> {
	const { course: slug } = await params;
	const { course, draftUrl } = await apiQuery(CourseDocument, { variables: { slug } });

	if (!course) return notFound();

	return buildMetadata({
		title: `Kurser — ${course.title}`,
		pathname: `/kurser/${slug}`,
	});
}
