'use client';
import s from './Views.module.scss';
import { CalendarView } from '@/components/forms/booking/types';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { Loader } from '@mantine/core';
import { Activity } from 'react';

export type CalenderProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	view: CalendarView['id'];
	start: Date;
	end: Date;
	loading?: boolean;
};

export function Views({ data, start, view, end, loading }: CalenderProps) {
	return (
		<div className={s.views}>
			<Activity mode={view === 'day' ? 'visible' : 'hidden'}>
				<DayView data={data} start={start} end={end} />
			</Activity>
			<Activity mode={view === 'week' ? 'visible' : 'hidden'}>
				<WeekView data={data} start={start} end={end} />
			</Activity>
			<Activity mode={view === 'month' ? 'visible' : 'hidden'}>
				<MonthView data={data} start={start} end={end} />
			</Activity>
			<Activity mode={loading ? 'visible' : 'hidden'}>
				<div className={s.loading}>
					<Loader color={'primaryLight'} />
				</div>
			</Activity>
		</div>
	);
}
