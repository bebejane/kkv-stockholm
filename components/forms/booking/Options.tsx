import s from './Options.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { Image } from 'react-datocms';
import { Selection } from './Selection';
import { NextButton } from '@/components/forms/booking/NextButton';

export type OptionsProps = {
	title: string;
	options?: Option[];
	selected?: string[];
	help?: any;
	multi: boolean;
	onChange: (selected?: string[]) => void;
	onCancel: () => void;
};

type Option = {
	id: string;
	label: string;
	image: FileField;
};

export function Options({
	title,
	options,
	selected,
	multi,
	help,
	onChange,
	onCancel,
}: OptionsProps) {
	if (!options) return null;

	const [selection, setSelection] = useState<string[]>(selected ?? []);
	const [confirmed, setConfirmed] = useState(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const t = e.currentTarget as HTMLInputElement;
		const value = t.value;
		setSelection((selection) =>
			!multi
				? [value]
				: selection.includes(value)
					? selection.filter((id) => id !== value)
					: [...selection, value],
		);
	}

	function handleSelect() {
		setConfirmed(selection.length > 0);
		if (selection.length > 0) window.scrollTo(0, 0);
	}

	function handleCancel() {
		setSelection([]);
		onChange(undefined);
		onCancel();
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
			<Selection
				key={selection.join(',')}
				title={title}
				value={options
					.filter(({ id }) => selection.includes(id))
					.map(({ label }) => label)
					.join(', ')}
				help={help}
				onCancel={handleCancel}
			/>
			{!confirmed && (
				<>
					<fieldset className={s.workshops}>
						{options.map(({ id, label, image }) => (
							<label key={id}>
								<input
									type={multi ? 'checkbox' : 'radio'}
									value={id}
									name={multi ? id : 'option'}
									checked={selection.includes(id) ? true : false}
									onChange={handleChange}
								/>
								<figure>
									{image?.responsiveImage && (
										<Image data={image.responsiveImage} fadeInDuration={0} />
									)}
									<figcaption className='mid'>{label}</figcaption>
								</figure>
							</label>
						))}
					</fieldset>
					{!options.length && <p className={s.empty}>Inga val tillgängliga</p>}
					<NextButton
						type='button'
						onClick={handleSelect}
						disabled={selection.length === 0}
						variant={'outline'}
					>
						Gå vidare
					</NextButton>
				</>
			)}
		</div>
	);
}
