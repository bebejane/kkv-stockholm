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
import {
	DateType,
	formatDateRange,
	isAfterOrSame,
	isBeforeOrSame,
	isInsideRange,
	isOutsideRange,
	isTouchingRange,
	tzDate,
	tzFormat,
} from '@/lib/dates';
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
	start,
	end,
	range,
	state: _state,
	className,
	children,
	view,
	onClick,
}: SlotProps) {
	const now = tzDate(new Date());
	const disabled = isBefore(start, now);
	const state = _state ?? (disabled ? 'disabled' : 'available');
	const _start =
		isBefore(start, range[0]) || isOutsideRange(range, [start, start])
			? addHours(startOfDay(range[0]), START_HOUR)
			: tzDate(start);
	const _end = isAfter(end, range[1]) ? range[1] : tzDate(end);
	const noDays = differenceInDays(_end, _start) + 1;

	//if (state === 'you') {
	//console.log(range[0], start, _start);
	//}

	const days = new Array(noDays)
		.fill(0)
		.map((_, i) => {
			const s = i === 0 ? _start : addHours(startOfDay(addDays(_start, i)), START_HOUR);
			const e = endOfDay(s) < _end ? endOfDay(s) : tzDate(_end);
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
	const fs = 'HH:mm';
	const s = tzDate(start);
	const e = tzDate(end);

	// Om start och end är samma, visa bara start
	if (isSameDay(s, e)) {
		return `${tzFormat(s, fs)} - ${tzFormat(e, 'HH:mm')}`.replaceAll('.', '');
	} else return `${tzFormat(s, f)} - ${tzFormat(e, f)}`.replaceAll('.', '');
}
