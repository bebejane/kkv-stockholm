import { Hr as ExtendedHr, HrProps } from '@react-email/components';
import { colors, spacing } from './theme';

const defaultStyles = {
	borderColor: colors.white,
	borderWidth: '1px',
	paddingTop: spacing.s5,
	paddingBottom: spacing.s8,
};

export default function Divider(props: HrProps) {
	return <ExtendedHr {...props} style={{ ...defaultStyles, ...props.style }} />;
}
