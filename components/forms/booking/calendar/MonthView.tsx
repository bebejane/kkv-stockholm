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
import { CalendarView } from '@/components/forms/booking/calendar/Calendar';

export type CalendarProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	start: Date;
	end: Date;
	userId?: string;
	view: CalendarView['id'];
	onSelected: (date: Date) => void;
	disabled: boolean;
};

export function MonthView({ data, start, end, userId, view, onSelected, disabled }: CalendarProps) {
	const startDate = startOfMonth(start);
	const lastDate = lastDayOfMonth(start);
	const startDateOffest = subDays(startDate, startDate.getDay() - 1);
	const noWeeks = differenceInCalendarWeeks(lastDate, startDate, { locale: sv }) + 1;
	const startWeek = getWeek(startOfMonth(start));
	const WEEKS = new Array(noWeeks).fill(null).map((_, idx) => `V ${startWeek + idx}`);

	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		const date = e.currentTarget.dataset.date;
		if (!date) throw new Error('No start date on column set');
		onSelected(tzDate(date));
	}

	return (
		<div className={s.month}>
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
