'use client';

import { useState } from 'react';
import s from './Selection.module.scss';
import cn from 'classnames';
import { Button } from '@mantine/core';

export type SelectionProps = {
	title: string;
	value?: string;
	help?: string;
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
					<Button
						variant='transparent'
						onMouseEnter={() => setShowHelp(true)}
						onMouseLeave={() => setShowHelp(false)}
					>
						Hjälp
					</Button>
				)}
			</header>
			{help && <div className={cn(s.help, showHelp && s.show, 'small')}>{help}</div>}
		</>
	);
}
