import Link from 'next/link';
import s from './Thumbnail.module.scss';
import { Image } from 'react-datocms';
import cn from 'classnames';
import { stripStega } from '@datocms/content-link';

type ThumbnailProps = {
	image: FileField;
	header?: string;
	layout?: 'center' | 'bottom';
	title?: string;
	href: string;
	shortCourse?: boolean;
	course?: boolean;
	overlayColor?: 'primary-light' | 'secondary';
	editingUrl?: string | null;
};

export function Thumbnail(props: ThumbnailProps) {
	const {
		image,
		header,
		title,
		layout = 'bottom',
		href,
		shortCourse,
		course,
		overlayColor = 'primary-light',
		editingUrl,
	} = stripStega(props);

	return (
		<Link href={href} className={s.thumbnail} data-datocms-content-link-source={props.title}>
			{header && <h3>{header}</h3>}
			{image?.responsiveImage && (
				<figure>
					<Image data={image.responsiveImage} intersectionMargin={'0px 0px 200% 0px'} />
					{((shortCourse && course) || !course) && (
						<figcaption className={cn(s[layout], 'mid')}>
							{shortCourse && course ? 'Introduktion' : title}
						</figcaption>
					)}
				</figure>
			)}
		</Link>
	);
}
