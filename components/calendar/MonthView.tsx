import s from './MonthView.module.scss';
import cn from 'classnames';
import React from 'react';
import { DAYS, END_HOUR, HOURS, START_HOUR, TZ } from '@/lib/constants';
import { formatInTimeZone } from 'date-fns-tz';
import { capitalize } from 'next-dato-utils/utils';
import { sv } from 'date-fns/locale';
import {
	differenceInDays,
	differenceInHours,
	getDay,
	getHours,
	isSameDay,
	isToday,
	startOfDay,
} from 'date-fns';
import { formatDateTimeRange, tzDate } from '@/lib/dates';
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
	const [data, range, setView] = useBookingCalendarStore(
		useShallow((state) => [state.data, state.range, state.setView]),
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
		setView('day', tzDate(date));
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
					const nodDays = differenceInDays(tzDate(end), tzDate(start)) + 1;
					const noHours = END_HOUR - START_HOUR;
					const locale = { locale: sv };

					return new Array(nodDays).fill(null).map((_, idx: number) => {
						const _start = addDays(tzDate(start), idx);
						const _end = isSameDay(_start, tzDate(end))
							? tzDate(end)
							: addHours(startOfDay(_start), END_HOUR);
						const wd = getDay(_start) === 0 ? 7 : getDay(_start);
						const gridRowStart =
							getWeek(_start, locale) - 1 - getWeek(startOfMonth(_start), locale) + 1;
						const gridRowEnd = gridRowStart;
						const gridColumnStart = hours.length * (wd - 1) + (getHours(_start) - START_HOUR) + 1;
						const gridColumnEnd = gridColumnStart + differenceInHours(_end, _start);

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
