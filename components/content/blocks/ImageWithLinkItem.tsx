import s from './ImageWithLinkItem.module.scss';
import { Image as DatoImage } from 'react-datocms';

export type ImageWithLinkItemBlockProps = {
	data: {
		image?: {
			responsiveImage?: any;
		} | null;
		text?: string | null;
		link?: string | null;
	};
};

export function ImageWithLinkItem({ data: { image, text, link } }: ImageWithLinkItemBlockProps) {
	const content = (
		<div className={s.imageWithLinkItem}>
			{image?.responsiveImage && (
				<figure className={s.image}>
					<DatoImage data={image.responsiveImage} intersectionMargin='0px 0px 200% 0px' />
				</figure>
			)}
			{text && (
				<div className={s.text}>
					<p>{text}</p>
				</div>
			)}
		</div>
	);

	if (link) {
		return (
			<a href={link} className={s.link}>
				{content}
			</a>
		);
	}

	return content;
}

