import s from './StaffItem.module.scss';
import { Image as DatoImage } from 'react-datocms';
import Content from '../Content';

export type StaffItemBlockProps = {
	data: {
		image?: {
			responsiveImage?: any;
		} | null;
		text?: any;
	};
};

export function StaffItem({ data: { image, text } }: StaffItemBlockProps) {
	return (
		<div className={s.staffItem}>
			{image?.responsiveImage && (
				<figure className={s.image}>
					<DatoImage data={image.responsiveImage} intersectionMargin='0px 0px 200% 0px' />
				</figure>
			)}
			{text && (
				<div className={s.text}>
					<Content content={text} />
				</div>
			)}
		</div>
	);
}

