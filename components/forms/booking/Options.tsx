import s from './Options.module.scss';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'react-datocms';
import { Selection } from './Selection';
import { NextButton } from '@/components/forms/booking/NextButton';
import { Empty } from '@/components/common/Empty';

export type OptionsProps = {
	title: string;
	options?: Option[];
	selected?: string[];
	help?: any;
	empty?: string;
	multi: boolean;

	onChange: (selected?: string[]) => void;
	onCancel: () => void;
};

type Option = {
	id: string;
	label: string;
	image: FileField;
	shared?: boolean;
};

export function Options({
	title,
	options,
	selected,
	multi,
	help,
	empty,

	onChange,
	onCancel,
}: OptionsProps) {
	const [selection, setSelection] = useState<string[]>(selected ?? []);
	const [confirmed, setConfirmed] = useState(false);
	// Keep the latest `onChange` without re-running the effects below when the
	// parent passes a new callback identity.
	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);
	const hasSelection = !!selected?.length;

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
		if (hasSelection && !multi && selection.length === 1) setConfirmed(true);
	}, [selection, hasSelection, multi]);

	useEffect(() => {
		confirmed && onChangeRef.current(selection);
	}, [selection, confirmed]);

	if (!options) return null;

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
						{options.map(({ id, label, image, shared }) => (
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
								{shared && <div className={s.shared} />}
							</label>
						))}
					</fieldset>
					{!options.length && <Empty className={s.empty}>{empty || 'Inga val tillgängliga'}</Empty>}
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
