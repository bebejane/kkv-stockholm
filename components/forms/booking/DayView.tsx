'use client';

import s from './DayView.module.scss';
import cn from 'classnames';
import React from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS, TZ } from '@/lib/constants';
import { CalendarView } from './Calender';
import { addDays, getWeek } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { capitalize } from 'next-dato-utils/utils';
import { sv } from 'date-fns/locale';
import { isToday } from 'date-fns';

export type CalenderProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	view?: CalendarView['id'];
	start: Date;
	end?: Date | null;
};

export function DayView({ data, start, view, end }: CalenderProps) {
	const title = capitalize(formatInTimeZone(new Date(start), TZ, 'EEEE dd', { locale: sv }));
	const today = isToday(new Date(start));
	return (
		<div className={s.week}>
			<div className={s.header}>v. {getWeek(start)}</div>
			<div className={cn(s.header, today && s.today)}>{title}</div>

			{HOURS.map((hour, i) => (
				<React.Fragment key={hour}>
					<div key={hour}>{hour}</div>
					<div></div>
				</React.Fragment>
			))}
			<div className={s.bookings}>
				{data?.map(({ id, start, end }) => (
					<div key={id} className={cn(s.c, s.unavailable)} style={{ gridRow: 3, gridColumn: 2 }}>
						{' '}
					</div>
				))}
			</div>
		</div>
	);
}
