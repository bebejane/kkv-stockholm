import s from './ComingCourses.module.scss';
import { Thumbnail } from '@/components/common/Thumbnail';
import { apiQuery } from 'next-dato-utils/api';
import { formatDateRange, tzDate } from '@/lib/dates';
import { parse } from 'graphql';
import { formatInTimeZone } from 'date-fns-tz';
import { TZ } from '@/lib/constants';

const ComingCoursesByStartDocument = parse(/* GraphQL */ `
	query ComingCoursesByStart($today: DateTime, $first: IntType = 4) {
		allCourses(filter: { start: { gte: $today } }, orderBy: start_ASC, first: $first) {
			id
			title
			slug
			start
			end
			image {
				...ImageFragment
			}
		}
	}

	fragment ImageFragment on FileFieldInterface {
		id
		width
		height
		alt
		basename
		format
		mimeType
		size
		title
		url
		responsiveImage {
			width
			height
			alt
			aspectRatio
			base64
			bgColor
			sizes
			src
			srcSet
			webpSrcSet
			title
		}
	}
`);

export async function ComingCourses() {
	// Use start-of-day in Stockholm timezone so "today" courses are included
	// even if they start earlier than the current time.
	const today = formatInTimeZone(new Date(), TZ, "yyyy-MM-dd'T'00:00:00xxx");
	const { allCourses } = await apiQuery(ComingCoursesByStartDocument, { variables: { today, first: 4 } });
	const courses = [...allCourses].sort((a, b) => {
		const aTime = a.start ? tzDate(a.start).getTime() : Number.POSITIVE_INFINITY;
		const bTime = b.start ? tzDate(b.start).getTime() : Number.POSITIVE_INFINITY;
		if (aTime !== bTime) return aTime - bTime;
		return (a.title ?? '').localeCompare(b.title ?? '', 'sv');
	});

	return (
		<ul className={s.comingCourses}>
			{courses.map((course) => (
				<li key={course.id}>
					<span className='caps'>{formatDateRange(course.start, course.end, { short: true })}</span>
					<Thumbnail image={course.image as FileField} href={`/kurser/${course.slug}`} />
					<a href={`/kurser/${course.slug}`}>
						<h4 className='big'>{course.title}</h4>
					</a>
				</li>
			))}
		</ul>
	);
}
