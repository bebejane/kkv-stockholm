import Text from './Text';
import { TextProps } from '@react-email/components';
import { fontFamily, lineHeight, fontWeight, fontSize, letterSpacing, textTransform, spacing } from './theme';

const defaultStyles = {
	fontFamily: '"KKV", Arial, Helvetica, Sans-Serif',
	fontWeight: fontWeight.normal,
	lineHeight: lineHeight.tight,
	fontSize: fontSize.lg,
	letterSpacing: letterSpacing.normal,
	textTransform: textTransform.normal,
	paddingBottom: spacing.s4,
};

export default function Heading(props: TextProps) {
	return (
		<Text {...props} style={{ ...defaultStyles, ...props.style }}>
			{props.children}
		</Text>
	);
}
