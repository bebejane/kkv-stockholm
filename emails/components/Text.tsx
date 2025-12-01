import { Text as ExtendedText, TextProps } from '@react-email/components';
import { spacing, colors } from './theme';

type Props = TextProps & {
	maxWidth?: number;
};

const defaultStyles = {
	paddingBottom: spacing.s4,
	color: colors.white,
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
