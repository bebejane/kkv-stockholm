import s from './Slot.module.scss';
import cn from 'classnames';
import {
	differenceInHours,
	getDay,
	isBefore,
	isSameDay,
	differenceInDays,
	addDays,
	startOfDay,
	addHours,
	endOfDay,
	isAfter,
} from 'date-fns';
import React, { CSSProperties } from 'react';
import { DateType, formatDateRange, isTouchingRange, tzDate, tzFormat } from '@/lib/dates';
import { END_HOUR, START_HOUR } from '@/lib/constants';

export type SlotProps = {
	start: Date;
	end: Date;
	disabled?: boolean;
	className?: string;
	state?: 'available' | 'unavailable' | 'shared' | 'you' | 'disabled';
	range: [Date, Date];
	view: 'day' | 'week' | 'month';
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	children?: React.ReactNode | React.ReactNode[] | string;
};

export function Slot({
	start: _start,
	end: _end,
	range,
	state: _state,
	className,
	children,
	view,
	onClick,
}: SlotProps) {
	const now = tzDate(new Date());
	const disabled = isBefore(_start, now);
	const state = _state ?? (disabled ? 'disabled' : 'available');
	const outside = !isTouchingRange(range, [_start, _end]);

	if (outside) return null;

	const start = isBefore(_start, range[0])
		? addHours(startOfDay(range[0]), START_HOUR)
		: tzDate(_start);

	const end = isAfter(_end, range[1]) ? range[1] : tzDate(_end);
	const noDays = differenceInDays(end, start) + 1;

	const days = new Array(noDays)
		.fill(0)
		.map((_, i) => {
			const s = i === 0 ? start : addHours(startOfDay(addDays(start, i)), START_HOUR);
			const e = endOfDay(s) < end ? endOfDay(s) : tzDate(end);
			return [s, e];
		})
		.filter(([s, e]) => isTouchingRange(range, [s, e]));

	return days.map((r, i) => (
		<div
			key={i}
			className={cn(s.slot, className)}
			data-type='slot'
			data-start={start}
			data-end={end}
			data-state={state}
			data-view={view}
			onClick={onClick ?? undefined}
			title={formatDateRange(_start, _end)}
			style={
				['unavailable', 'shared', 'you'].includes(state) ? slotStyle(r[0], r[1], view) : undefined
			}
		>
			{children}
			{state === 'you' && i == 0 && !children && <h5>Din tid: {formatYouDateRange(start, end)}</h5>}
		</div>
	));
}

function slotStyle(s: Date, e: Date, view: 'day' | 'week' | 'month'): CSSProperties {
	if (!s || !e) return {};
	const start = tzDate(s);
	const end = tzDate(e);
	const col = view === 'day' ? 1 : getDay(start) === 0 ? 7 : getDay(s);
	const rowStart = tzDate(start).getHours() - START_HOUR + 1;
	const rowEnd = Math.abs(differenceInHours(start, end)) + rowStart;

	return {
		gridColumn: col,
		gridRow: `${rowStart} / ${rowEnd}`,
	};
}

export function formatYouDateRange(start: DateType, end: DateType): string {
	if (!start || !end) return '';
	const f = 'd MMM HH:mm';
	const s = tzDate(start);
	const e = tzDate(end);
	return `${tzFormat(s, f)} - ${tzFormat(e, 'HH:mm')}`.replaceAll('.', '');
}
