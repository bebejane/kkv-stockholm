import s from './ComingCourses.module.scss';
import { Thumbnail } from '@/components/common/Thumbnail';
import { ComingCoursesDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import Link from 'next/link';

export async function ComingCourses() {
	const { allCourses } = await apiQuery(ComingCoursesDocument, { revalidate: 3600 });

	return (
		<ul className={s.comingCourses}>
			{allCourses.map((course) => (
				<li key={course.id}>
					<Thumbnail
						image={course.image as FileField}
						header={course.title}
						title={course.title}
						href={`/kurser/${course.slug}`}
					/>
				</li>
			))}
		</ul>
	);
}
