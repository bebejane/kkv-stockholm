import { StructuredContent } from 'next-dato-utils/components';
import * as Blocks from './blocks/index';

export type Props = {
	id?: string;
	content: any;
	styles?: any;
	className?: string;
	blocks?: any;
};

export default function Content({ id, content, styles, blocks, className }: Props) {
	if (!content) return null;

	return (
		<StructuredContent
			blocks={{ ...Blocks, ...blocks }}
			className={className}
			styles={{
				...styles,
			}}
			content={content}
		/>
	);
}
