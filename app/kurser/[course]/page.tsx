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

function hasDatoStructuredContent(content: any): boolean {
	if (!content) return false;
	if (Array.isArray(content?.blocks) && content.blocks.length > 0) return true;
	if (Array.isArray(content?.inlineBlocks) && content.inlineBlocks.length > 0) return true;

	const document = content?.value?.document;
	const visit = (node: any): boolean => {
		if (!node) return false;
		if (typeof node?.value === 'string' && node.value.trim().length > 0) return true;
		const children = node?.children;
		return Array.isArray(children) ? children.some(visit) : false;
	};

	return visit(document);
}

export default async function CoursePage({ params }: PageProps<'/kurser/[course]'>) {
	const { course: slug } = await params;
	const { course, courseTerm, draftUrl } = await apiQuery(CourseDocument, { variables: { slug } });

	if (!course) return notFound();

	const { intro, about, targetGroup, goal, aboutOrganizer, organizerLink, image, member, price, amount, start, end, workshop, language, shortCourse, included, preparation } = course;
	const hasLanguage = typeof language === 'string' ? language.trim().length > 0 : Boolean(language);
	const courseTermContent = shortCourse ? courseTerm?.short : courseTerm?.long;

	return (
		<>
			<article>
				<h1>{course.title}</h1>
				<section className={cn(s.header, 'margin-right margin-bottom intro content-grid')}>
					<Content content={intro} />
					<figure className={s.image}>{image?.responsiveImage && <Image data={image.responsiveImage} />}</figure>
				</section>
				<section className={'margin-right margin-bottom content'}>
					<h2>Om kursen</h2>
					<Content content={about} />
				</section>
				{included && (
					<section className={'margin-right margin-bottom content'}>
						<h2>Ingår i kursen</h2>

						<p>{included}</p>
					</section>
				)}
				{preparation && hasDatoStructuredContent(preparation) && (
					<section className={'margin-right margin-bottom content'}>
						<h2>Förberedelser</h2>
						<Content content={preparation} />
					</section>
				)}
				{courseTermContent && hasDatoStructuredContent(courseTermContent) && (
					<section className={'margin-right margin-bottom content'}>
						<h2>Villkor</h2>
						<Content content={courseTermContent} />
					</section>
				)}
				{hasDatoStructuredContent(aboutOrganizer) && (
					<section className={'margin-right margin-bottom content'}>
						<h2>Om kursledaren</h2>
						<Content content={aboutOrganizer} />
						{organizerLink && (
							<p>
								<a href={organizerLink}>Läs mer</a>
							</p>
						)}
					</section>
				)}

				<section className={cn('line margin-bottom', s.summary)}>
					<header>
						<h2>Summering</h2>
					</header>
					<div className={cn(s.meta)}>
						<ul className='meta mid content-grid'>
							<li>
								<span>Datum:</span> <span>{formatDate(start)}</span>
							</li>
							<li>
								<span>Tid:</span> <span>{formatTimeRange(start, end)}</span>
							</li>
							<li>
								<span>Plats:</span> <span>{workshop?.title || ''}</span>
							</li>
							{amount && (
								<li>
									<span>Antal deltagare:</span> <span>{amount}</span>
								</li>
							)}
							<li>
								<span>Kursledare:</span>{' '}
								<span>
									{member.firstName} {member.lastName}
								</span>
							</li>
							<li>
								<span>Pris:</span> <span>{price} kr (inkl moms)</span>
							</li>
							{hasLanguage && (
								<li>
									<span>Språk:</span> <span>{language}</span>
								</li>
							)}

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
			</article >
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
