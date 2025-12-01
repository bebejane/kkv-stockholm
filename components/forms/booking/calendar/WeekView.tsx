import s from './WeekView.module.scss';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS } from '@/lib/constants';
import { addDays, addHours, getDay, getWeek, isAfter, isBefore } from 'date-fns';
import { capitalize } from 'next-dato-utils/utils';
import { isToday } from 'date-fns';
import { tzDate, tzFormat } from '@/lib/dates';
import { Slot } from './Slot';
import { useCalendarSelection, useShallow } from './hooks/useCalendarSelection';

export type WeekViewProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	start: Date;
	end: Date;
};

export function WeekView({ data, start, end }: WeekViewProps) {
	const [selection] = useCalendarSelection(useShallow((s) => [s.selection]));

	function columnDate(wd: number, hour: number) {
		return addDays(addHours(start, hour), wd);
	}

	function filterSelection(s: Date, e: Date) {
		return (s === start || isAfter(s, start)) && (e === end || isBefore(e, end));
	}

	return (
		<div className={s.container}>
			<div className={cn(s.grid, s.week)}>
				<div className={s.header}>v. {getWeek(start)}</div>
				{DAYS.map((d, i) => {
					const date = addDays(new Date(start), i);
					const title = capitalize(tzFormat(date, 'E dd'));
					return (
						<div className={cn(s.header, isToday(date) && s.today)} key={d}>
							{title}
						</div>
					);
				})}

				<div className='small'>Heldag</div>
				{DAYS.map((day) => (
					<div key={day}>
						<Checkbox label={'Boka heldag'} size={'xs'} />
					</div>
				))}

				<div className={cn(s.hours, 'very-small')}>
					{HOURS.map((hour, h) => (
						<div className='very-small'>{hour}</div>
					))}
				</div>

				<div className={s.sub}>
					{HOURS.map((hour, h) =>
						new Array(DAYS.length)
							.fill(null)
							.map((_, wd: number) => (
								<Slot key={wd} start={columnDate(wd, h)} end={columnDate(wd, h + 1)} />
							))
					)}
				</div>
				<div className={cn(s.sub, s.bookings)}>
					{data?.map(({ id, start, end }) => (
						<Slot key={id} state='unavailable' start={start} end={end} />
					))}
				</div>
				<div className={cn(s.sub, s.selection)}>
					{selection && <Slot state={'you'} start={selection[0]} end={selection[1]} />}
				</div>
			</div>
		</div>
	);
}
