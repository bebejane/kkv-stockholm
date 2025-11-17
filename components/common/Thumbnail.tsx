import Link from 'next/link';
import s from './Thumbnail.module.scss';
import { Image } from 'react-datocms';

type ThumbnailProps = {
	image: FileField;
	header?: string;
	layout?: 'center' | 'bottom';
	title: string;
	href: string;
};

export function Thumbnail({ image, header, title, layout = 'bottom', href }: ThumbnailProps) {
	return (
		<Link href={href} className={s.thumbnail}>
			{header && <h3>{header}</h3>}
			<figure>
				{image?.responsiveImage && <Image data={image.responsiveImage} />}
				<figcaption className={s[layout]}>{title}</figcaption>
			</figure>
		</Link>
	);
}
