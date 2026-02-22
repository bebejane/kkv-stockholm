import s from './MonthView.module.scss';
import cn from 'classnames';
import React from 'react';
import { DAYS, END_HOUR, HOURS, START_HOUR, TZ } from '@/lib/constants';
import { formatInTimeZone } from 'date-fns-tz';
import { capitalize } from 'next-dato-utils/utils';
import { sv } from 'date-fns/locale';
import { differenceInHours, getDay, getWeeksInMonth, isToday } from 'date-fns';
import { formatDateRange, formatDateTimeRange, tzDate } from '@/lib/dates';
import { Slot } from './Slot';
import {
	addDays,
	addHours,
	differenceInCalendarWeeks,
	formatDate,
	getWeek,
	lastDayOfMonth,
	startOfMonth,
	subDays,
} from 'date-fns';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';

export type CalendarProps = {
	userId?: string;
	visible: boolean;
	disabled: boolean;
};

export function MonthView({ userId, visible, disabled }: CalendarProps) {
	const [range, data, setSelection, view] = useBookingCalendarStore(
		useShallow((state) => [state.range, state.data, state.setSelection, state.view]),
	);
	const startDate = startOfMonth(range[0]);
	const lastDate = lastDayOfMonth(range[1]);
	const startDateOffest = subDays(startDate, startDate.getDay() - 1);
	const noWeeks = differenceInCalendarWeeks(lastDate, startDate, { locale: sv }) + 1;
	const startWeek = getWeek(startOfMonth(range[0]), { locale: sv });
	const WEEKS = new Array(noWeeks).fill(null).map((_, idx) => `V ${startWeek + idx}`);
	const hours = HOURS.filter((_, h) => h >= START_HOUR && h < END_HOUR);

	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		const date = e.currentTarget.dataset.date;
		if (!date) throw new Error('No start date on column set');
		//setSelection(tzDate(date));
	}

	return (
		<div className={cn(s.month, !visible && s.hidden)}>
			<div className={s.header} />
			{DAYS.map((d, i) => {
				const date = addDays(startDateOffest, i);
				const title = capitalize(formatInTimeZone(date, TZ, 'EEEE', { locale: sv }));
				return (
					<div className={cn(s.header, isToday(date) && s.today)} key={d}>
						{title}
					</div>
				);
			})}
			{WEEKS.map((week, i) => (
				<React.Fragment key={week}>
					<div className={cn(s.c, 'very-small')}>{week}</div>
					{new Array(DAYS.length).fill(null).map((_, idx: number) => {
						const slotStart = addDays(startDateOffest, i * DAYS.length + idx);
						return (
							<div key={idx} className={s.weekday} onClick={handleClick} data-date={slotStart}>
								{formatDate(slotStart, 'd')}
							</div>
						);
					})}
				</React.Fragment>
			))}
			<div className={s.bookings}>
				{data?.map(({ id, member, start, end }) => {
					const _start = tzDate(start);
					const _end = tzDate(end);

					const day = getDay(_start);
					const week = getWeek(_start, { locale: sv }) - 1;
					const startWeek = getWeek(range[0], { locale: sv });
					const row = week - startWeek + 1;
					const colStart = day * hours.length - 1 - _start.getHours() - START_HOUR;
					const noHours = differenceInHours(_end, _start);

					const gridColumnStart = colStart;
					const gridColumnEnd = colStart + noHours;
					const gridRowStart = row;
					const gridRowEnd = row;

					return (
						<div
							key={id}
							className={s.slot}
							data-start={tzDate(start)}
							data-end={tzDate(end)}
							data-range={range}
							data-state={member.user === userId ? 'you' : 'unavailable'}
							data-view={'month'}
							title={formatDateTimeRange(_start, _end)}
							style={{
								gridColumnStart,
								gridColumnEnd,
								gridRowStart,
								gridRowEnd,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
}
