import s from './DaySlot.module.scss';
import cn from 'classnames';
import {
	differenceInHours,
	getDay,
	isBefore,
	differenceInDays,
	addDays,
	endOfDay,
	isAfter,
} from 'date-fns';
import React, { CSSProperties, useState } from 'react';
import { formatDateTimeRange, formatSlotDateRange, isTouchingRange, tzDate } from '@/lib/dates';
import { START_HOUR } from '@/lib/constants';

export type DaySlotProps = {
	start: Date;
	end: Date;
	disabled?: boolean;
	className?: string;
	state?: 'available' | 'unavailable' | 'shared' | 'you' | 'selection' | 'disabled';
	range: [Date, Date];
	view: 'day' | 'week' | 'month';
	index?: number;
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
	view,
	index,
	onClick,
}: DaySlotProps) {
	const [hover, setHover] = useState(false);
	const now = tzDate(new Date());
	const disabled = isBefore(_start, now);
	const state = _state ?? (disabled ? 'disabled' : 'available');
	const outside = !isTouchingRange(range, [_start, _end]);

	if (outside) return null;

	const start = isBefore(_start, range[0]) ? tzDate(range[0], START_HOUR) : tzDate(_start);
	const end = isAfter(_end, range[1]) ? range[1] : tzDate(_end);
	const noDays = differenceInDays(end, start) + 1;

	const days = new Array(noDays)
		.fill(0)
		.map((_, i) => {
			const s = i === 0 ? start : tzDate(addDays(start, i), START_HOUR);
			const e = endOfDay(s) < end ? endOfDay(s) : tzDate(end);
			return [s, e];
		})
		.filter(([s, e]) => isTouchingRange(range, [s, e]));

	return days.map((r, i) => (
		<div
			key={i}
			className={cn(s.slot, i === 0 && s.first, i - 1 === days.length - 1 && s.last, className)}
			data-type='slot'
			data-start={start}
			data-end={end}
			data-state={state}
			data-view={view}
			onClick={onClick ?? undefined}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={
				['unavailable', 'shared', 'you', 'selection'].includes(state)
					? slotStyle(r[0], r[1], view, index)
					: undefined
			}
		>
			<div>
				{children && i === 0 && children}
				{state === 'selection' && i == 0 && !children && (
					<h5>{formatSlotDateRange(_start, _end)}</h5>
				)}
			</div>
		</div>
	));
}

function slotStyle(
	s: Date,
	e: Date,
	view: 'day' | 'week' | 'month',
	index?: number,
): CSSProperties {
	if (!s || !e) return {};
	const start = tzDate(s);
	const end = tzDate(e);
	const col = view === 'day' ? 1 : getDay(end) === 0 ? 7 : getDay(s);
	const rowStart = tzDate(start).getHours() - START_HOUR + 1;
	const rowEnd = rowStart + Math.abs(differenceInHours(start, end));

	return {
		gridColumn: col,
		gridRow: `${rowStart} / ${rowEnd}`,
		zIndex: index,
	};
}
