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
				paddingLeft: spacing.s11,
				paddingRight: spacing.s11,
				paddingTop: spacing.s5,
				paddingBottom: spacing.s5,
				width: 'auto',
				textAlign: 'center',
				letterSpacing: letterSpacing.wide,
				textTransform: textTransform.big as 'uppercase',
				backgroundColor: colors.primary,
				color: colors.white,
				border: 'none',
				borderRadius: '0px',
				marginTop: spacing.s6,
				marginBottom: spacing.s8,
			}}
		/>
	);
}
