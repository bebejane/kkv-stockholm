import s from './Options.module.scss';
import cn from 'classnames';
import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Image } from 'react-datocms';
import { Selection } from './Selection';

export type OptionsProps = {
	title: string;
	options?: Option[];
	selected?: string[];
	help?: string;
	multi: boolean;
	onChange: (selected: string[]) => void;
};

type Option = {
	id: string;
	label: string;
	image: FileField;
};

export function Options({ title, options, selected, multi, help, onChange }: OptionsProps) {
	if (!options) return null;

	const [selection, setSelection] = useState<string[]>(selected ?? []);
	const [confirmed, setConfirmed] = useState(false);
	const [showHelp, setShowHelp] = useState(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const t = e.currentTarget as HTMLInputElement;
		const value = t.value;
		setSelection((selection) =>
			selection.find((id) => id === value) ? selection : multi ? [...selection, value] : [value]
		);
	}

	function handleSelect() {
		setConfirmed(selection.length > 0);
	}

	useEffect(() => {
		if (selection.length === 0) setConfirmed(false);
		if (selected && !multi && selection.length === 1) setConfirmed(true);
	}, [selection]);

	useEffect(() => {
		confirmed && onChange(selection);
	}, [selection, confirmed]);

	return (
		<div className={s.options}>
			{confirmed ? (
				<Selection
					title={title}
					items={options.filter(({ id }) => selection.includes(id)).map(({ label }) => label)}
					onCancel={() => setSelection([])}
				/>
			) : (
				<>
					<header>
						<h3>Välj {title}</h3>
						{help && <span className={cn(s.help, showHelp && s.show, 'small')}>{help}</span>}
						<Button
							variant='transparent'
							onMouseOver={() => setShowHelp(true)}
							onMouseLeave={() => setShowHelp(false)}
						>
							Hjälp
						</Button>
					</header>
					<fieldset className={s.workshops}>
						{options.map(({ id, label, image }) => (
							<label key={id}>
								<input
									type='radio'
									value={id}
									name={multi ? id : 'option'}
									onChange={handleChange}
								/>
								<figure>
									{image?.responsiveImage && <Image data={image.responsiveImage} />}
									<figcaption className='mid'>{label}</figcaption>
								</figure>
							</label>
						))}
					</fieldset>
					<Button
						type='button'
						variant='outline'
						onClick={handleSelect}
						fullWidth={true}
						disabled={selection.length === 0}
						className={s.next}
					>
						Gå vidare
					</Button>
				</>
			)}
		</div>
	);
}
