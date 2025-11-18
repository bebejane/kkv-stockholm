import Content from '@/components/content/Content';
import s from './page.module.scss';
import { CourseDocument, StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { Image } from 'react-datocms';
import { formatDate, formatTimeRange } from '@/lib/utils';

export default async function Course({ params }: PageProps<'/kurser/[course]'>) {
	const { course: slug } = await params;
	const { course, draftUrl } = await apiQuery(CourseDocument, { variables: { slug } });

	if (!course) return notFound();

	const { intro, image, organizer, price, start, end, workshop } = course;
	return (
		<>
			<article>
				<h1>{course.title}</h1>
				<section className={s.intro}>
					<Content content={intro} />
					{image?.responsiveImage && <Image data={image.responsiveImage} />}
				</section>
				<section className={s.summary}>
					<header>
						<h2>Summering</h2>
					</header>
					<div className={s.meta}>
						<div>
							<span>Datum</span> <span>{formatDate(start)}</span>
							<span>Plats</span> <span></span>
							<span>Tid</span> <span>{formatTimeRange(start, end)}</span>
							<span>Antal deltagare</span> <span>8</span>
						</div>
						<div>
							<span>Kursledare</span> <span>{organizer.name}</span>
							<span>Pris</span> <span>{price} kr (inkl moms)</span>
							<span>Anmäl senast</span> <span>31 oktober 12:00</span>
						</div>
					</div>
				</section>
				<section className={s.apply}>
					<header>
						<h2>Anmälan</h2>
					</header>
				</section>
			</article>
			<DraftMode url={draftUrl} path={`/kurser/${slug}`} />
		</>
	);
}
