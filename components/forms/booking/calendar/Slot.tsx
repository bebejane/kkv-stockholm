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
} from 'date-fns';
import React, { CSSProperties } from 'react';
import { isAfterOrSame, isBeforeOrSame, tzDate } from '@/lib/dates';
import { END_HOUR, START_HOUR } from '@/lib/constants';

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
	const now = tzDate(new Date());
	const disabled = isBefore(start, now);
	const state = _state ?? (disabled ? 'disabled' : 'available');

	const days = new Array(differenceInDays(end, start) + 1).fill(0).map((_, i) => {
		const s = i === 0 ? start : addHours(startOfDay(addDays(start, i)), START_HOUR);
		const e = endOfDay(s) < end ? endOfDay(s) : end;
		return [s, e];
	});

	return days.map((range, i) => (
		<div
			key={i}
			className={cn(s.slot, className)}
			data-type='slot'
			data-start={start}
			data-end={end}
			data-state={state}
			data-view={view}
			onClick={onClick ?? undefined}
			style={
				['unavailable', 'shared', 'you'].includes(state)
					? slotStyle(range[0], range[1], view)
					: undefined
			}
		>
			{children}
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
