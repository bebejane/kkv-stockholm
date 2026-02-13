'use client';

import s from './DayView.module.scss';
import cn from 'classnames';
import React, { useEffect, useRef } from 'react';
import { HOURS, DAYS, TZ, START_HOUR, END_HOUR } from '@/lib/constants';
import { CalendarView } from './Calendar';
import { addHours, getWeek } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { capitalize } from 'next-dato-utils/utils';
import { sv } from 'date-fns/locale';
import { isToday } from 'date-fns';
import { Slot } from './Slot';
import { formatDateTimeRange, formatTimeRange, tzDate, tzFormat } from '@/lib/dates';
import { useSlotSelection } from '@/components/forms/booking/calendar/hooks/useSlotSelection';

export type CalendarProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	start: Date;
	end?: Date | null;
	userId?: string;
	view: CalendarView['id'];
	onSelection: (start: Date, end: Date) => void;
};

export function DayView({ data, start, end, userId, view, onSelection }: CalendarProps) {
	const gridRef = useRef<HTMLDivElement | null>(null);
	const { selection, reset } = useSlotSelection({ ref: gridRef });
	const title = tzFormat(start, 'EEE dd');
	const today = isToday(tzDate(start));
	const hours = HOURS.filter((_, h) => h >= START_HOUR && h <= END_HOUR);

	useEffect(() => {
		selection && onSelection(selection[0], selection[1]);
	}, [selection]);

	useEffect(() => {
		reset();
	}, [view]);

	return (
		<div className={s.week}>
			<div className={s.header} />
			<div className={cn(s.header, today && s.today)}>{title}</div>
			<div className={s.hours}>
				{hours.map((hour, h) => (
					<div className="very-small" key={hour}>{hour}</div>
				))}
			</div>
			<div className={s.sub} ref={gridRef}>
				{hours.map((hour, h) => (
					<Slot
						key={h}
						start={addHours(start, parseInt(hour))}
						end={addHours(start, parseInt(hour) + 1)}
						view='day'
					//state={'available'}
					/>
				))}
			</div>
			<div className={cn(s.sub, s.bookings)}>
				{data?.map(({ id, start, end, member, equipment, note }) => (
					<Slot
						key={id}
						state={member.user === userId ? 'you' : 'unavailable'}
						start={start}
						end={end}
						view='day'
					>
						<>
							<h5>
								{member?.firstName} {member?.lastName}
							</h5>
							<p>
								{formatTimeRange(start, end)}
								<br />
								{equipment?.map(({ title }) => title).join(', ')}
								{note && (
									<>
										<br />
										{note}
									</>
								)}
							</p>
						</>
					</Slot>
				))}
			</div>
			<div className={cn(s.sub, s.selection)}>
				{selection && <Slot state={'you'} start={selection[0]} end={selection[1]} view='day' />}
			</div>
		</div>
	);
}
