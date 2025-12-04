import s from './Slot.module.scss';
import cn from 'classnames';
import { differenceInHours, getDay, isBefore, isSameDay } from 'date-fns';
import { CSSProperties } from 'react';
import { isAfterOrSame, isBeforeOrSame, tzDate } from '@/lib/dates';

export type SlotProps = {
	start: Date;
	end: Date;
	disabled?: boolean;
	label?: string;
	className?: string;
	state?: 'available' | 'unavailable' | 'shared' | 'you' | 'disabled';
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export function Slot({ start, end, state: _state, label, className, onClick }: SlotProps) {
	const outsideRange = false; //!range || isBefore(start, range[0]) || isAfter(end, range[1]);
	const now = tzDate(new Date());
	const disabled = isBefore(start, now);
	const state = _state ?? (disabled ? 'disabled' : 'available');

	return (
		<div
			className={cn(s.slot, className)}
			data-type='slot'
			data-start={start}
			data-end={end}
			data-state={state}
			style={state === 'you' ? slotStyle(start, end) : undefined}
		>
			{label}
		</div>
	);
}

function slotStyle(s: Date, e: Date): CSSProperties {
	const col = getDay(s) === 0 ? 7 : getDay(s);
	const rowStart = s.getHours() + 1;
	const rowEnd = Math.abs(differenceInHours(s, e)) + rowStart;

	return {
		gridColumn: col,
		gridRow: `${rowStart} / ${rowEnd}`,
	};
}
