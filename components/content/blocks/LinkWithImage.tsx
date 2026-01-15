import s from './LinkWithImage.module.scss';
import { ImageWithLinkItem } from './ImageWithLinkItem';

export type LinkWithImageBlockProps = {
	data: {
		items?: Array<{
			__typename: string;
			id: string;
			image?: {
				responsiveImage?: any;
			} | null;
			text?: string | null;
			link?: string | null;
		}>;
	};
};

export function LinkWithImage({ data: { items } }: LinkWithImageBlockProps) {
	if (!items || items.length === 0) return null;

	return (
		<div className={s.linkWithImage}>
			{items.map((item) => (
				<ImageWithLinkItem key={item.id} data={item} />
			))}
		</div>
	);
}

