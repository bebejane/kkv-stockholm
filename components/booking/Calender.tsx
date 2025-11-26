'use client';

import s from './Calender.module.scss';
import cn from 'classnames';
import React from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS } from '@/lib/constants';
import { CalendarView } from '@/components/booking/types';
import { getWeek } from 'date-fns';

export type CalenderProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	view?: CalendarView['id'];
	start: Date;
	end?: Date | null;
};

export function Calender({ data, start, end }: CalenderProps) {
	return (
		<div className={s.calendar}>
			<div className={s.c}>v. {getWeek(start)}</div>
			{DAYS.map((day) => (
				<div className={s.c} key={day}>
					{day}
				</div>
			))}
			<div className={s.c}>Heldag</div>
			{DAYS.map((day) => (
				<div className={s.c} key={day}>
					<Checkbox label={'Boka heldag'} />
				</div>
			))}
			{HOURS.map((hour, i) => (
				<React.Fragment key={hour}>
					<div className={s.c}>{hour}</div>
					{new Array(HOURS.length - 1).fill(null).map((_, idx: number) => (
						<div className={s.c} key={idx}></div>
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
