import Link from 'next/link';
import s from './Thumbnail.module.scss';
import { Image } from 'react-datocms';
import cn from 'classnames';

type ThumbnailProps = {
	image: FileField;
	header?: string;
	layout?: 'center' | 'bottom';
	title?: string;
	href: string;
};

export function Thumbnail({ image, header, title, layout = 'bottom', href }: ThumbnailProps) {
	return (
		<Link href={href} className={s.thumbnail}>
			{header && <h3>{header}</h3>}
			{image?.responsiveImage && (
				<figure>
					<Image data={image.responsiveImage} />
					{title && <figcaption className={cn(s[layout], 'mid')}>{title}</figcaption>}
				</figure>
			)}
		</Link>
	);
}
