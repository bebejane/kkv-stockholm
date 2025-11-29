import s from './Views.module.scss';
import { CalendarView } from './Calender';
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
	setView: (view: CalendarView['id'], start?: Date) => void;
	onSelection: (start: Date, end: Date) => void;
};

export function Views({ data, start, end, view, setView, loading, onSelection }: CalenderProps) {
	return (
		<div className={s.views}>
			<Activity mode={view === 'day' ? 'visible' : 'hidden'}>
				<DayView data={data} start={start} end={end} />
			</Activity>
			<Activity mode={view === 'week' ? 'visible' : 'hidden'}>
				<WeekView data={data} start={start} end={end} onSelection={onSelection} />
			</Activity>
			<Activity mode={view === 'month' ? 'visible' : 'hidden'}>
				<MonthView data={data} start={start} end={end} onSelected={(d) => setView('week', d)} />
			</Activity>
			<Activity mode={loading ? 'visible' : 'hidden'}>
				<div className={s.loading}>
					<Loader color={'primaryLight'} />
				</div>
			</Activity>
		</div>
	);
}
