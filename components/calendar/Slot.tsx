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
	noHover?: boolean;
	onHover?: (hover: boolean) => void;
	children?: React.ReactNode | React.ReactNode[] | string;
};

export function Slot({
	start,
	end,
	state,
	className,
	style,
	hover,
	onHover,
	noHover,
	children,
}: SlotProps) {
	const [_hover, setHover] = useState<boolean>(false);

	function handleHover(e: React.MouseEvent<HTMLDivElement>) {
		setHover(e.type !== 'mouseleave');
	}

	useEffect(() => {
		onHover?.(_hover);
	}, [_hover]);

	return (
		<div
			className={cn(s.slot, className)}
			data-type='slot'
			data-start={start}
			data-end={end}
			data-state={state}
			data-hover={noHover ? undefined : (hover ?? _hover)}
			onMouseLeave={handleHover}
			onMouseEnter={handleHover}
			style={style}
		>
			<div>{children}</div>
		</div>
	);
}
