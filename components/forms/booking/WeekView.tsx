'use client';

import s from './WeekView.module.scss';
import cn from 'classnames';
import React from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS, TZ } from '@/lib/constants';
import { CalendarView } from '@/components/forms/booking/types';
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

export function WeekView({ data, start, view, end }: CalenderProps) {
	return (
		<div className={s.week}>
			<div className={s.header}>v. {getWeek(start)}</div>
			{DAYS.map((d, i) => {
				const date = addDays(new Date(start), i);
				const title = capitalize(formatInTimeZone(date, TZ, 'E dd', { locale: sv }));
				return (
					<div className={cn(s.header, isToday(date) && s.today)} key={d}>
						{title}
					</div>
				);
			})}
			<div>Heldag</div>
			{DAYS.map((day) => (
				<div key={day}>
					<Checkbox label={'Boka heldag'} size={'xs'} />
				</div>
			))}
			{HOURS.map((hour, i) => (
				<React.Fragment key={hour}>
					<div>{hour}</div>
					{new Array(DAYS.length).fill(null).map((_, idx: number) => (
						<div key={idx}></div>
					))}
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
