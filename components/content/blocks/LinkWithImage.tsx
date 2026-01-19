import s from './LinkWithImage.module.scss';
import { ImageWithLinkItem } from './ImageWithLinkItem';
import cn from 'classnames';


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
		<div className={cn(s.linkWithImage, 'content-grid')}>
			{items.map((item) => (
				<ImageWithLinkItem key={item.id} data={item} />
			))}
		</div>
	);
}

