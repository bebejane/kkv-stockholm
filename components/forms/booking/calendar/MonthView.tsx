import s from './MonthView.module.scss';
import cn from 'classnames';
import React from 'react';
import { DAYS, TZ } from '@/lib/constants';
import { formatInTimeZone } from 'date-fns-tz';
import { capitalize } from 'next-dato-utils/utils';
import { sv } from 'date-fns/locale';
import { isToday } from 'date-fns';
import { tzDate } from '@/lib/dates';
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
	const [start, end, data, setSelection] = useBookingCalendarStore(
		useShallow((state) => [state.start, state.end, state.data, state.setSelection]),
	);
	const startDate = startOfMonth(start);
	const lastDate = lastDayOfMonth(start);
	const startDateOffest = subDays(startDate, startDate.getDay() - 1);
	const noWeeks = differenceInCalendarWeeks(lastDate, startDate, { locale: sv }) + 1;
	const startWeek = getWeek(startOfMonth(start));
	const WEEKS = new Array(noWeeks).fill(null).map((_, idx) => `V ${startWeek + idx}`);

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
						const slotEnd = addHours(slotStart, 1);
						return (
							<div key={idx} className={s.slot} onClick={handleClick} data-date={slotStart}>
								{formatDate(slotStart, 'd')}
							</div>
						);
					})}
				</React.Fragment>
			))}
			<div className={s.bookings}>
				{data?.map(({ id, start, end }) => (
					<Slot
						key={id}
						start={tzDate(start)}
						end={tzDate(end)}
						state={'unavailable'}
						view={'month'}
					/>
				))}
			</div>
		</div>
	);
}
