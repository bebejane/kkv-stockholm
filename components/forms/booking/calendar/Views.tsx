import s from './Views.module.scss';
import { CalendarView } from './Calendar';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { Loader } from '@mantine/core';
import { Activity } from 'react';

export type CalendarProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	view: CalendarView['id'];
	start: Date;
	end: Date;
	loading?: boolean;
	userId?: string;
	setView: (view: CalendarView['id'], start?: Date) => void;
	onSelection: (start: Date | null, end?: Date) => void;
};

export function Views({
	data,
	start,
	end,
	view,
	userId,
	setView,
	loading,
	onSelection,
}: CalendarProps) {
	return (
		<div className={s.views}>
			<Activity mode={view === 'day' ? 'visible' : 'hidden'}>
				<DayView
					data={data}
					start={start}
					end={end}
					userId={userId}
					onSelection={onSelection}
					view={view}
				/>
			</Activity>
			<Activity mode={view === 'week' ? 'visible' : 'hidden'}>
				<WeekView
					data={data}
					start={start}
					end={end}
					userId={userId}
					onSelection={onSelection}
					view={view}
				/>
			</Activity>
			<Activity mode={view === 'month' ? 'visible' : 'hidden'}>
				<MonthView
					data={data}
					start={start}
					end={end}
					userId={userId}
					onSelected={(d) => setView('week', d)}
					view={view}
				/>
			</Activity>
			<Activity mode={loading ? 'visible' : 'hidden'}>
				<div className={s.loading}>
					<Loader color={'primaryLight'} />
				</div>
			</Activity>
		</div>
	);
}
