import { Text as ExtendedText, TextProps } from '@react-email/components';
import { spacing, colors, lineHeight, fontSize } from './theme';

type Props = TextProps & {
	maxWidth?: number;
};

const defaultStyles = {
	paddingTop: 0,
	paddingBottom: spacing.s7,
	color: colors.black,
	lineHeight: '126%', // 140% * 0.9 = 126%
	fontSize: fontSize.base, // 17px
};

export default function Text({ children, maxWidth, ...props }: Props) {
	if (maxWidth) {
		return (
			<ExtendedText {...props} className='text' style={{ ...defaultStyles, ...props.style }}>
				<div style={{ maxWidth }}>{children}</div>
			</ExtendedText>
		);
	} else
		return (
			<ExtendedText {...props} className='text' style={{ ...defaultStyles, ...props.style }}>
				{children}
			</ExtendedText>
		);
}
