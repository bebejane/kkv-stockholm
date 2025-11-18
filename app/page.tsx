import StartGallery from '@/components/start/StartGallery';
import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import Content from '@/components/content/Content';
import Link from 'next/link';
import { Suspense } from 'react';
import { ComingCourses } from '@/components/start/ComingCourses';
import { Temperatures } from '@/components/start/Temperatures';
import { Thumbnail } from '@/components/common/Thumbnail';

export default async function Home({ params }: PageProps<'/'>) {
	const { start, allWorkshops, draftUrl } = await apiQuery(StartDocument);

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
						<Content content={start.aboutUs} />
					</div>
					<div className={s.shortcuts}>
						<h2>Genvägar</h2>
						<ul>
							<li>
								<Link href='/medlem/boka-verkstad'>Boka verkstad</Link>
							</li>
							<li>
								<Link href='/medlem/rapportera-tid/'>Rapportera tid</Link>
							</li>
							<li>
								<Link href='/biljetter/'>Biljetter</Link>
							</li>
						</ul>
					</div>
				</section>
				<section id='start-coming-courses' className={s.comingCourses}>
					<header>
						<h2 className="big">Kommande kurser</h2>
						<Link href='/kurser'>Visa alla</Link>
					</header>
					<Suspense>
						<ComingCourses />
					</Suspense>
				</section>
				<section id='start-temperatures' className={s.temperatures}>
					<h2>Temperaturer just nu</h2>
					<Suspense>
						<Temperatures />
					</Suspense>
				</section>
				<section id='start-our-workshops' className={s.workshops}>
					<header>
						<h2 className="big">Våra verkstäder</h2>
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
								/>
							</li>
						))}
					</ul>
				</section>
			</article>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
