'use client';

import s from './StaffItem.module.scss';
import { Image as DatoImage } from 'react-datocms';
import { stripStega } from '@datocms/content-link';
import Content from '../Content';

export type StaffItemBlockProps = {
	data: StaffItemRecord;
};

export function StaffItem(props: StaffItemBlockProps) {
	const {
		data: { image, text, _editingUrl },
	} = stripStega(props);
	return (
		<div
			className={s.staffItem}
			data-datocms-content-link-group={true}
			data-datocms-content-link-url={_editingUrl}
		>
			{image?.responsiveImage && (
				<figure className={s.image}>
					<DatoImage data={image.responsiveImage} intersectionMargin='0px 0px 200% 0px' />
				</figure>
			)}
			{text && (
				<div className={s.text} data-datocms-content-link-group={true}>
					<Content content={text} />
				</div>
			)}
		</div>
	);
}
