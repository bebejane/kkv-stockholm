import { differenceInHours, isBefore, isAfter } from 'date-fns';
import React, { CSSProperties, useState } from 'react';
import { formatSlotDateRange, isTouchingRange, tzDate } from '@/lib/dates';
import { START_HOUR } from '@/lib/constants';
import { Slot } from '@/components/calendar/Slot';

export type DaySlotProps = {
	start: Date;
	end: Date;
	disabled?: boolean;
	className?: string;
	state?: 'available' | 'unavailable' | 'shared' | 'you' | 'selection' | 'disabled';
	range: [Date, Date];
	index: number;
	offset?: number;
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	children?: React.ReactNode | React.ReactNode[] | string;
};

export function DaySlot({
	start: _start,
	end: _end,
	range,
	state: _state,
	className,
	children,
	index,
	offset = 0,
}: DaySlotProps) {
	const now = tzDate(new Date());
	const disabled = isBefore(_start, now);
	const state = _state ?? (disabled ? 'disabled' : 'available');
	const outside = !isTouchingRange(range, [_start, _end]);

	if (outside) return null;

	const start = isBefore(_start, range[0]) ? tzDate(range[0], START_HOUR) : tzDate(_start);
	const end = isAfter(_end, range[1]) ? range[1] : tzDate(_end);

	return (
		<Slot
			className={className}
			start={start}
			end={end}
			state={state}
			noHover={true}
			style={slotStyle(start, end, index, offset)}
		>
			{children}
			{state === 'selection' && !children && <h5>{formatSlotDateRange(_start, _end)}</h5>}
		</Slot>
	);
}

function slotStyle(start: Date, end: Date, index: number, offset: number): CSSProperties {
	if (!start || !end) return {};
	const gridColumnStart = index + 1 + offset;
	const gridColumnEnd = gridColumnStart + 1 + offset;
	const gridRowStart = tzDate(start).getHours() - START_HOUR + 1;
	const gridRowEnd = gridRowStart + Math.abs(differenceInHours(start, end));

	return {
		gridColumnStart,
		gridColumnEnd,
		gridRowStart,
		gridRowEnd,
		zIndex: index,
	};
}
