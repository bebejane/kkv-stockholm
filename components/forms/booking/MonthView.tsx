import s from './MonthView.module.scss';
import cn from 'classnames';
import React from 'react';
import { DAYS, TZ } from '@/lib/constants';
import {
	addDays,
	differenceInCalendarWeeks,
	formatDate,
	getWeek,
	isAfter,
	isBefore,
	lastDayOfMonth,
	startOfMonth,
	subDays,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { capitalize } from 'next-dato-utils/utils';
import { sv } from 'date-fns/locale';
import { isToday } from 'date-fns';
import { tzDate } from '@/lib/dates';

export type CalenderProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	start: Date;
	end: Date;
	onSelected: (date: Date) => void;
};

export function MonthView({ data, start, end, onSelected }: CalenderProps) {
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
			<div className={s.header}></div>
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
					<div className={cn(s.c)}>{week}</div>
					{new Array(DAYS.length).fill(null).map((_, idx: number) => {
						const d = addDays(startDateOffest, i * DAYS.length + idx);
						const inactive = isBefore(d, start) || isAfter(d, end);
						return (
							<div key={idx} className={cn(s.c, inactive && s.inactive)} data-date={d} onClick={handleClick}>
								{formatDate(d, 'd')}
							</div>
						);
					})}
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
