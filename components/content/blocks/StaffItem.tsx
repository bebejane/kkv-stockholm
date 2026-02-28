'use client';

import s from './StaffItem.module.scss';
import { Image as DatoImage, stripStega } from 'react-datocms';
import Content from '../Content';

export type StaffItemBlockProps = {
	data: StaffItemRecord;
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
				<div
					className={s.text}
					data-datocms-content-link-group={true}
					data-datocms-content-link-source={text.value}
				>
					<Content content={stripStega(text)} />
				</div>
			)}
		</div>
	);
}
