'use client';

import s from './StaffItem.module.scss';
import { stripStega } from '@datocms/content-link';
import Content from '../Content';

export type StaffItemBlockProps = {
	data: StaffItemRecord;
};

export function StaffItem(props: StaffItemBlockProps) {
	const {
		data: { text, _editingUrl },
	} = stripStega(props);
	return (
		<div
			className={s.staffItem}
			data-datocms-content-link-group={true}
			data-datocms-content-link-url={_editingUrl}
		>
			{text && (
				<div className={s.text} data-datocms-content-link-group={true}>
					<Content content={text} />
				</div>
			)}
		</div>
	);
}
