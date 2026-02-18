import s from './NextButton.module.scss';
import cn from 'classnames';
import { Button } from '@mantine/core';

type NextButtonProps = {
	disabled?: boolean;
	type: 'button' | 'submit';
	variant?: 'filled' | 'outline';
	loading?: boolean;
	sticky?: boolean;
	children: string;
	className?: string;
	onClick?: () => void;
};

export default function NextButton({
	disabled,
	loading,
	children,
	type,
	variant = 'outline',
	sticky = true,
	className,
	onClick,
}: NextButtonProps) {
	return (
		<Button
			type={type}
			loading={loading}
			variant={variant}
			onClick={onClick}
			fullWidth={true}
			disabled={disabled}
			className={cn(s.next, sticky && s.sticky, disabled && s.disabled, className)}
		>
			{children}
		</Button>
	);
}
