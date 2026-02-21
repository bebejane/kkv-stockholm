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
	onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function Selection({ title, value, help, onCancel }: SelectionProps) {
	const [showHelp, setShowHelp] = useState(false);
	const [paused, setPaused] = useState(false);

	function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
		setPaused(true);
		setTimeout(() => setPaused(false), 300);
		setTimeout(() => onCancel(e), 50);
	}

	return (
		<>
			<header className={s.selection}>
				<h3>
					{title}: {value}
				</h3>
				{value ? (
					<Button variant='transparent' onClick={handleCancel}>
						Ångra
					</Button>
				) : (
					<span
						className={cn(s.helpToggle, 'small')}
						onClick={() => setShowHelp(showHelp ? false : true)}
						onMouseEnter={() => !paused && setShowHelp(true)}
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
