import { useEffect, useState } from 'react';
import s from './Slot.module.scss';
import cn from 'classnames';

export type SlotProps = {
	start: Date;
	end: Date;
	className?: string;
	style?: React.CSSProperties;
	state?: 'available' | 'unavailable' | 'shared' | 'you' | 'selection' | 'disabled';
	hover?: boolean;
	onHover?: (hover: boolean) => void;
	children?: React.ReactNode | React.ReactNode[] | string;
};

export function Slot({
	start,
	end,
	state,
	className,
	style,
	hover: _hover,
	onHover,
	children,
}: SlotProps) {
	const [hover, setHover] = useState<boolean>(false);

	useEffect(() => {
		onHover?.(hover);
	}, [hover]);

	return (
		<div
			className={cn(s.slot, (_hover || hover) && s.hover, className)}
			data-type='slot'
			data-start={start}
			data-end={end}
			data-state={state}
			onMouseEnter={() => setHover(true)}
			onMouseMove={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={style}
		>
			<div>{children}</div>
		</div>
	);
}
