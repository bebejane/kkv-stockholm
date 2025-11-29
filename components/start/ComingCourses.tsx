import s from './ComingCourses.module.scss';
import { Thumbnail } from '@/components/common/Thumbnail';
import { AllComingCoursesDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';

export async function ComingCourses() {
	const { allCourses } = await apiQuery(AllComingCoursesDocument);

	return (
		<ul className={s.comingCourses}>
			{allCourses.map((course) => (
				<li key={course.id}>
					<span className='caps'>Datum</span>
					<Thumbnail image={course.image as FileField} href={`/kurser/${course.slug}`} />
					<a href={`/kurser/${course.slug}`}>
						<h4 className='big'>{course.title}</h4>
					</a>
				</li>
			))}
		</ul>
	);
}
