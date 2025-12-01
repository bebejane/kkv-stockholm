import s from './Selection.module.scss';
import { Button } from '@mantine/core';

export type SelectionProps = {
	title: string;
	items?: string[];
	label?: string;
	onCancel: () => void;
};

export function Selection({ title, items, label, onCancel }: SelectionProps) {
	return (
		<header className={s.selection}>
			<h3>
				{title}: {label ?? items?.join(', ')}
			</h3>
			<Button variant='transparent' onClick={onCancel}>
				Ångra
			</Button>
		</header>
	);
}
