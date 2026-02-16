import Link from 'next/link';
import s from './Thumbnail.module.scss';
import { Image } from 'react-datocms';
import cn from 'classnames';
import { Route } from 'next';

type ThumbnailProps = {
	image: FileField;
	header?: string;
	layout?: 'center' | 'bottom';
	title?: string;
	href: string;
	shortCourse?: boolean;
	overlayColor?: 'primary-light' | 'secondary';
};

export function Thumbnail({ image, header, title, layout = 'bottom', href, shortCourse, overlayColor = 'primary-light' }: ThumbnailProps) {
	return (
		<Link href={href} className={s.thumbnail}>
			{header && <h3>{header}</h3>}
			{image?.responsiveImage && (
				<figure>
					<Image data={image.responsiveImage} intersectionMargin={'0px 0px 200% 0px'} />
					{shortCourse && (
						<>
							<div className={cn(s.overlay, s[overlayColor])} />
							<h4 className={s.shortCourseLabel}>Introduktion</h4>
						</>
					)}
					{title && <figcaption className={cn(s[layout], 'mid')}>{title}</figcaption>}
				</figure>
			)}
		</Link>
	);
}
