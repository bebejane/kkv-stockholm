'use client';

import { useState } from 'react';
import s from './Selection.module.scss';
import cn from 'classnames';
import { Button } from '@mantine/core';
import { StructuredContent } from 'next-dato-utils/components';
import Content from '@/components/content/Content';

export type SelectionProps = {
	title: string;
	value?: string;
	help?: any;
	onCancel: () => void;
};

export function Selection({ title, value, help, onCancel }: SelectionProps) {
	const [showHelp, setShowHelp] = useState(false);
	return (
		<>
			<header className={s.selection}>
				<h3>
					{title}: {value}
				</h3>
				{value ? (
					<Button variant='transparent' onClick={onCancel}>
						Ångra
					</Button>
				) : (
					<span
						className={cn('small')}
						onMouseEnter={() => setShowHelp(true)}
						onMouseLeave={() => setShowHelp(false)}
					>
						Hjälp
					</span>
				)}
			</header>
			{help && <Content content={help} className={cn(s.help, showHelp && s.show, 'small')} />}
		</>
	);
}
