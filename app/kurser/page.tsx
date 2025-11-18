import s from './page.module.scss';
import { Thumbnail } from '@/components/common/Thumbnail';
import { AllCoursesDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Courses({ params }: PageProps<'/kurser'>) {
	const { allCourses } = await apiQuery(AllCoursesDocument, { all: true });

	return (
		<>
			<article className={s.courses}>
				<header>
					<h1>Aktuella Kurser</h1>
					<Link href='/kurser/alla'>Visa alla kurser</Link>
				</header>
				<section id='courses'>
					<ul>
						{allCourses.map(({ image, title, slug, id }) => (
							<li key={id}>
								<Thumbnail image={image as FileField} title={title} href={`/kurser/${slug}`} />
							</li>
						))}
					</ul>
				</section>
			</article>
			{/* <DraftMode url={draftUrl} path={`/`} /> */}
		</>
	);
}
