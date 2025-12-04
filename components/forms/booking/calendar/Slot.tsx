import s from './Slot.module.scss';
import cn from 'classnames';
import { differenceInHours, getDay, isBefore, isSameDay } from 'date-fns';
import React, { CSSProperties } from 'react';
import { isAfterOrSame, isBeforeOrSame, tzDate } from '@/lib/dates';

export type SlotProps = {
	start: Date;
	end: Date;
	disabled?: boolean;
	className?: string;
	state?: 'available' | 'unavailable' | 'shared' | 'you' | 'disabled';
	view: 'day' | 'week' | 'month';
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	children?: React.ReactNode | React.ReactNode[] | string;
};

export function Slot({ start, end, state: _state, className, children, view, onClick }: SlotProps) {
	const outsideRange = false; //!range || isBefore(start, range[0]) || isAfter(end, range[1]);
	const now = tzDate(new Date());
	const disabled = isBefore(start, now);
	const state = _state ?? (disabled ? 'disabled' : 'available');
	const style = ['unavailable', 'shared', 'you'].includes(state)
		? slotStyle(start, end, view)
		: undefined;

	return (
		<div
			className={cn(s.slot, className)}
			data-type='slot'
			data-start={start}
			data-end={end}
			data-state={state}
			data-view={view}
			style={style}
			onClick={onClick ?? undefined}
		>
			{children}
		</div>
	);
}

function slotStyle(s: Date, e: Date, view: 'day' | 'week' | 'month'): CSSProperties {
	if (!s || !e) return {};
	const start = tzDate(s);
	const end = tzDate(e);
	const col = view === 'day' ? 1 : getDay(start) === 0 ? 7 : getDay(s);
	const rowStart = tzDate(start).getHours() + 1;
	const rowEnd = Math.abs(differenceInHours(start, end)) + rowStart;
	console.log(rowStart, rowEnd);
	return {
		gridColumn: col,
		gridRow: `${rowStart} / ${rowEnd}`,
	};
}
