import s from './page.module.scss';
import { buildMetadata } from '@/app/layout';
import { Thumbnail } from '@/components/common/Thumbnail';
import { AllCoursesDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { formatDateRange } from '@/lib/utils';

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
						{allCourses.map(({ image, title, start, end, slug, id }) => (
							<li key={id}>
								<span className='caps'>{formatDateRange(start, end, { short: true })}</span>
								<Thumbnail image={image as FileField} href={`/kurser/${slug}`} />
								<a href={`/kurser/${slug}`}>
									<h4 className='big'>{title}</h4>
								</a>
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
