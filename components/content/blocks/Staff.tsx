import s from './Staff.module.scss';
import { StaffItem } from './StaffItem';

export type StaffBlockProps = {
	data: {
		staffList?: Array<{
			__typename: string;
			id: string;
			image?: {
				responsiveImage?: any;
			} | null;
			text?: any;
		}>;
	};
};

export function Staff({ data: { staffList } }: StaffBlockProps) {
	if (!staffList || staffList.length === 0) return null;

	return (
		<div className={s.staff}>
			{staffList.map((item) => (
				<StaffItem key={item.id} data={item} />
			))}
		</div>
	);
}

