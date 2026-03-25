import s from './page.module.scss';
import cn from 'classnames';
import { AllComingCoursesDocument, StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { TemperatureLoading, Temperatures } from '@/components/start/Temperatures';
import { Thumbnail } from '@/components/common/Thumbnail';
import { formatDateRange, tzDate } from '@/lib/dates';
import StartGallery from '@/components/start/StartGallery';
import Content from '@/components/content/Content';
import Link from 'next/link';

export default async function HomePage({ params }: PageProps<'/'>) {
	const { start, allWorkshops, draftUrl } = await apiQuery(StartDocument);
	const { allCourses, draftUrl: allCoursesDraftUrl } = await apiQuery(AllComingCoursesDocument, {
		variables: { today: tzDate(new Date()), first: 4 },
	});

	if (!start) return notFound();

	return (
		<>
			<article>
				<h1>{start.title}</h1>
				<section id='start-gallery' className={s.gallery}>
					<StartGallery gallery={start.gallery} />
				</section>
				<section id='start-about-us' className={s.aboutUs}>
					<div className={s.about}>
						<h2>Om oss</h2>
						<Content className={'intro'} content={start.aboutUs} />
					</div>
					<div className={s.shortcuts}>
						<h2>Genvägar</h2>
						<ul className='mid'>
							<li>
								<h3>
									<Link href='/medlem/bokningar/ny' scroll={false}>
										Boka verkstad
									</Link>
								</h3>
							</li>
							<li>
								<h3>
									<Link href='/medlem/rapporter' scroll={false}>
										Rapportera tid
									</Link>
								</h3>
							</li>
							<li>
								<h3>
									<Link href='/kurser' scroll={false}>
										Kurser
									</Link>
								</h3>
							</li>
							<li>
								<h3>
									<Link href='/bli-medlem' scroll={false}>
										Bli medlem
									</Link>
								</h3>
							</li>
						</ul>
					</div>
				</section>
				<section id='start-coming-courses' className={cn('line', s.comingCourses)}>
					<header>
						<h2 className='big'>Kommande kurser</h2>
						<Link href='/kurser'>Visa alla</Link>
					</header>
					<ul>
						{allCourses.map(({ id, title, shortCourse, start, end, image, slug, _editingUrl }) => (
							<li
								key={id}
								data-datocms-content-link-url={_editingUrl}
								data-datocms-content-link-group
							>
								<span className='caps'>{formatDateRange(start, end, { short: true })}</span>
								<Thumbnail
									title={title}
									shortCourse={shortCourse}
									image={image as FileField}
									href={`/kurser/${slug}`}
									editingUrl={_editingUrl}
								/>
								<a href={`/kurser/${slug}`}>
									<h4 className='big'>{!shortCourse ? title : 'Introduktion'}</h4>
								</a>
							</li>
						))}
					</ul>
				</section>
				<section id='start-temperatures' className={cn('line', s.temperatures)}>
					<h2>Temperaturer just nu</h2>
					<Suspense fallback={<TemperatureLoading />}>
						<Temperatures />
					</Suspense>
				</section>
				<section id='start-our-workshops' className={cn('line', s.workshops)}>
					<header>
						<h2 className='big'>Våra verkstäder</h2>
						<Link href='/verkstader'>Visa alla</Link>
					</header>
					<ul>
						{allWorkshops.map((workshop) => (
							<li key={workshop.id}>
								<Thumbnail
									image={workshop.image as FileField}
									title={workshop.title}
									layout='center'
									href={`/verkstader/${workshop.slug}`}
									editingUrl={workshop._editingUrl}
								/>
							</li>
						))}
					</ul>
				</section>
			</article>
			<DraftMode url={[draftUrl, allCoursesDraftUrl]} path='/' />
		</>
	);
}
