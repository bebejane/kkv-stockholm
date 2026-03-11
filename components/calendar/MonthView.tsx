import s from './MonthView.module.scss';
import cn from 'classnames';
import React from 'react';
import { DAYS, END_HOUR, HOURS_PER_DAY, START_HOUR } from '@/lib/constants';

import {
	differenceInDays,
	differenceInHours,
	getDay,
	getHours,
	isAfter,
	isBefore,
	isSameDay,
	isToday,
	startOfDay,
} from 'date-fns';
import { formatDateTimeRange, getWeekday, isInsideRange, tzDate } from '@/lib/dates';
import {
	addDays,
	differenceInCalendarWeeks,
	formatDate,
	getWeek,
	lastDayOfMonth,
	startOfMonth,
	subDays,
} from 'date-fns';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';
import { sv } from 'date-fns/locale';

export type CalendarProps = {
	userId?: string;
	visible: boolean;
};

export function MonthView({ userId, visible }: CalendarProps) {
	const [selection, data, range, setView] = useBookingCalendarStore(
		useShallow((state) => [state.selection, state.data, state.range, state.setView]),
	);

	const startDate = startOfMonth(range[0]);
	const endDate = lastDayOfMonth(range[1]);
	const startDateOffset = tzDate(startOfDay(subDays(startDate, getWeekday(startDate) - 1)));
	const endDateOffest = tzDate(addDays(endDate, 7 - getWeekday(endDate)));
	const startWeek = getWeek(startOfMonth(range[0]), { locale: sv });
	const noWeeks = differenceInCalendarWeeks(endDateOffest, startDateOffset, { locale: sv }) + 1;
	const weeks = new Array(noWeeks).fill(null).map((_, idx) => `V ${startWeek + idx}`);
	const currentSelectionSlot = {
		start: selection?.[0],
		end: selection?.[1],
		member: { user: userId },
		selection: true,
	} as any;

	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		const date = e.currentTarget.dataset.date;
		if (!date) throw new Error('No start date on column set');
		setView('week', tzDate(date));
	}
	console.log(noWeeks);
	return (
		<div
			//@ts-ignore
			style={{ '--rows': noWeeks }}
			className={cn(s.month, !visible && s.hidden)}
		>
			<div className={s.header} />
			{DAYS.map((d, i) => {
				const date = addDays(startDateOffset, i);
				return (
					<div className={cn(s.header, isToday(date) && s.today)} key={d}>
						{d}
					</div>
				);
			})}
			{weeks.map((week, i) => (
				<React.Fragment key={week}>
					<div className={cn(s.weekno, 'very-small')}>{week}</div>
					{new Array(DAYS.length).fill(null).map((_, idx: number) => {
						const now = tzDate(new Date());
						const slotStart = startOfDay(addDays(startDateOffset, i * DAYS.length + idx));
						const disabled =
							isBefore(slotStart, startDate) ||
							isAfter(slotStart, endDate) ||
							isBefore(slotStart, now);

						return (
							<div
								role='button'
								key={idx}
								className={s.weekday}
								onClick={handleClick}
								data-date={slotStart}
								aria-disabled={disabled}
							>
								{formatDate(slotStart, 'd')}
							</div>
						);
					})}
				</React.Fragment>
			))}
			<div className={s.bookings}>
				{data
					?.filter(({ start, end }) => start && end && isInsideRange(range, [start, end]))
					.map(({ member, start, end, equipment }) => {
						const noDays = differenceInDays(tzDate(startOfDay(end)), tzDate(startOfDay(start))) + 1;

						return new Array(noDays).fill(null).map((_, idx: number) => {
							const _start =
								idx > 0 ? addDays(tzDate(start, START_HOUR), idx) : addDays(tzDate(start), idx);
							const _end = isSameDay(_start, tzDate(end)) ? tzDate(end) : tzDate(_start, END_HOUR);

							const wd = getDay(_start) === 0 ? 7 : getDay(_start);
							const gridColumnStart = HOURS_PER_DAY * (wd - 1) + getHours(_start) - START_HOUR + 1;
							const gridColumnEnd = gridColumnStart + differenceInHours(_end, _start);
							const gridRowStart =
								getWeek(_start, { locale: sv }) - getWeek(startOfMonth(_start), { locale: sv }) + 1;
							const gridRowEnd = gridRowStart;

							const state =
								member.user === userId
									? 'you'
									: equipment.some((e) => e.exclusive)
										? 'unavailable'
										: 'shared';

							return (
								<div
									key={_start.toISOString()}
									className={s.slot}
									data-start={tzDate(start)}
									data-end={tzDate(end)}
									data-range={range}
									data-state={state}
									style={{
										gridColumnStart,
										gridColumnEnd,
										gridRowStart,
										gridRowEnd,
									}}
								/>
							);
						});
					})}
			</div>
		</div>
	);
}
