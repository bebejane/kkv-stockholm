import s from './page.module.scss';
import { buildMetadata } from '@/app/(website)/layout';
import { Thumbnail } from '@/components/common/Thumbnail';
import { AllCoursesDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export default async function CoursesPage({ params }: PageProps<'/kurser'>) {
	const { allCourses } = await apiQuery(AllCoursesDocument, { all: true });

	return (
		<>
			<article className={s.courses}>
				<header>
					<h1>Aktuella Kurser</h1>
					<Link className='small' href='/kurser/alla'>
						Visa tidigare kurser
					</Link>
				</header>
				<section id='courses'>
					<ul>
						{allCourses.map(({ image, title, slug, id }) => (
							<li key={id}>
								<span className='caps'>Björn: Skriv ut datum här</span>
								<Thumbnail image={image as FileField} title=' ' href={`/kurser/${slug}`} />
								<h4 className='big'>{title}</h4>
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
