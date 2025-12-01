'use client';

import s from './DayView.module.scss';
import cn from 'classnames';
import React from 'react';
import { HOURS, DAYS, TZ } from '@/lib/constants';
import { CalendarView } from './Calendar';
import { addHours, getWeek } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { capitalize } from 'next-dato-utils/utils';
import { sv } from 'date-fns/locale';
import { isToday } from 'date-fns';
import { Slot } from './Slot';

export type CalendarProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	view?: CalendarView['id'];
	start: Date;
	end?: Date | null;
};

export function DayView({ data, start, end }: CalendarProps) {
	const title = capitalize(formatInTimeZone(new Date(start), TZ, 'EEEE dd', { locale: sv }));
	const today = isToday(new Date(start));

	return (
		<div className={s.week}>
			<div className={s.header}>v. {getWeek(start)}</div>
			<div className={cn(s.header, today && s.today)}>{title}</div>
			{HOURS.map((hour, h) => (
				<React.Fragment key={hour}>
					<div>{hour}</div>
					<Slot start={addHours(start, h)} end={addHours(start, h + 1)} />
				</React.Fragment>
			))}
			<div className={s.bookings}>
				{data?.map(({ id, start, end }) => (
					<Slot key={id} state='unavailable' start={start} end={end} />
				))}
			</div>
		</div>
	);
}
