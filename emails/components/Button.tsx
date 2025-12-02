import { Button as ExtendedButton, ButtonProps } from '@react-email/components';
import {
	colors,
	fontSize,
	borderRadius,
	lineHeight,
	spacing,
	letterSpacing,
	textTransform,
} from './theme';

export default function Button(props: ButtonProps) {
	return (
		<ExtendedButton
			{...props}
			className='light-mode'
			style={{
				lineHeight: lineHeight.tight,
				fontSize: fontSize.sm,
				height: spacing.s10,
				paddingLeft: spacing.s11,
				paddingRight: spacing.s11,
				width: '100%',
				textAlign: 'center',
				letterSpacing: letterSpacing.wide,
				textTransform: textTransform.big as 'uppercase',
				backgroundColor: colors.transparent,
				color: colors.white,
				border: '1px solid white',
				borderRadius: '0px',
				paddingTop: spacing.s7,
			}}
		/>
	);
}
