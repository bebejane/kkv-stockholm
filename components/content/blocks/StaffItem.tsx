'use client';

import s from './StaffItem.module.scss';
import { Image as DatoImage, stripStega } from 'react-datocms';
import Content from '../Content';

export type StaffItemBlockProps = {
	data: StaffItemRecord;
};

export function StaffItem({ data: { image, text } }: StaffItemBlockProps) {
	console.log(text);
	return (
		<div className={s.staffItem} data-datocms-content-link-group={true}>
			{image?.responsiveImage && (
				<figure className={s.image}>
					<DatoImage data={image.responsiveImage} intersectionMargin='0px 0px 200% 0px' />
				</figure>
			)}
			{text && (
				<div className={s.text} data-datocms-content-link-group={true}>
					<Content content={stripStega(text)} />
				</div>
			)}
		</div>
	);
}
