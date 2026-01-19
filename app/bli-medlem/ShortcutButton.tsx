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
				const el = document.getElementById(targetId);
				if (!el) return;
				const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
				el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
			}}
		>
			{children}
		</Button>
	);
}

