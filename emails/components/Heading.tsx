import Text from './Text';
import { TextProps } from '@react-email/components';
import { fontFamily, lineHeight, fontWeight, fontSize, letterSpacing, textTransform } from './theme';

const defaultStyles = {
	fontFamily: fontFamily.sans,
	fontWeight: fontWeight.normal,
	lineHeight: lineHeight.tight,
	fontSize: fontSize.lg,
	letterSpacing: letterSpacing.normal,
	textTransform: textTransform.normal,
};

export default function Heading(props: TextProps) {
	return (
		<Text {...props} style={{ ...defaultStyles, ...props.style }}>
			{props.children}
		</Text>
	);
}
