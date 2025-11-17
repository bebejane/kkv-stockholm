import s from './page.module.scss';
import { CourseDocument, StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';

export default async function Course({ params }: PageProps<'/kurser/[course]'>) {
	const { course: slug } = await params;
	const { course, draftUrl } = await apiQuery(CourseDocument, { variables: { slug } });

	if (!course) return notFound();

	return (
		<>
			<article>
				<h1>{course.title}</h1>
			</article>
			{<DraftMode url={draftUrl} path={`/kurser/${slug}`} />}
		</>
	);
}
