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
import { formatDateTimeRange, isInsideRange, tzDate } from '@/lib/dates';
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
	disabled: boolean;
};

export function MonthView({ userId, visible, disabled }: CalendarProps) {
	const [selection, data, range, setView] = useBookingCalendarStore(
		useShallow((state) => [state.selection, state.data, state.range, state.setView]),
	);

	const startDate = startOfMonth(range[0]);
	const lastDate = lastDayOfMonth(range[1]);
	const swd = startDate.getDay() === 0 ? 7 : startDate.getDay() + 1;
	const ewd = lastDate.getDay() === 0 ? 7 : lastDate.getDay() + 1;
	const startDateOffest = tzDate(startOfDay(subDays(startDate, swd - 1)));
	const endDateOffest = tzDate(addDays(lastDate, 7 - ewd));
	const noWeeks = differenceInCalendarWeeks(endDateOffest, startDateOffest, { locale: sv }) + 1;
	const startWeek = getWeek(startOfMonth(range[0]), { locale: sv });
	const WEEKS = new Array(noWeeks).fill(null).map((_, idx) => `V ${startWeek + idx}`);
	const currentSelectionSlot = {
		start: selection?.[0],
		end: selection?.[1],
		member: { user: userId },
	} as any;

	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		const date = e.currentTarget.dataset.date;
		if (!date) throw new Error('No start date on column set');
		setView('week', tzDate(date));
	}

	return (
		<div
			//@ts-ignore
			style={{ '--rows': noWeeks }}
			className={cn(s.month, !visible && s.hidden)}
		>
			<div className={s.header} />
			{DAYS.map((d, i) => {
				const date = addDays(startDateOffest, i);
				return (
					<div className={cn(s.header, isToday(date) && s.today)} key={d}>
						{d}
					</div>
				);
			})}
			{WEEKS.map((week, i) => (
				<React.Fragment key={week}>
					<div className={cn(s.c, 'very-small')}>{week}</div>
					{new Array(DAYS.length).fill(null).map((_, idx: number) => {
						const now = tzDate(new Date());
						const slotStart = startOfDay(addDays(startDateOffest, i * DAYS.length + idx));
						const disabled =
							isBefore(slotStart, startDate) ||
							isAfter(slotStart, lastDate) ||
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
					?.concat([currentSelectionSlot])
					.filter(({ start, end }) => start && end && isInsideRange(range, [start, end]))
					.map(({ member, start, end }) => {
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

							return (
								<div
									key={_start.toISOString()}
									className={s.slot}
									data-start={tzDate(start)}
									data-end={tzDate(end)}
									data-range={range}
									data-state={member.user === userId ? 'you' : 'unavailable'}
									title={formatDateTimeRange(_start, _end)}
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
