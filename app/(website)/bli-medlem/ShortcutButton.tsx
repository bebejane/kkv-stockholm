'use client';

import { Button, ButtonProps } from '@mantine/core';

type Props = Omit<ButtonProps, 'onClick'> & {
	targetId: string;
};

export function ShortcutButton({ targetId, children, ...props }: Props) {
	return (
		<Button
			{...props}
			onClick={() => {
				document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}}
		>
			{children}
		</Button>
	);
}
