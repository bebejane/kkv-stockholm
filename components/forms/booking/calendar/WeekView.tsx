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

	/*
	function handleSelection(e: React.MouseEvent<HTMLDivElement>) {
		const date = e.currentTarget.dataset.date;

		if (!date) throw new Error('No start date on column set');

		const start = tzDate(date);
		const end = addHours(start, 1);
		const range: [Date, Date] = [start, end];

		setSelection((selection) => {
			const exists = selection?.find(([s1, e1]) => s1 === start && e1 === end) ? true : false;
			if (exists) return [];
			return [...(selection ?? []), range];
		});
	}
*/

	function columnDate(wd: number, hour: number) {
		return addDays(addHours(start, hour), wd);
	}

	function filterSelection(s: Date, e: Date) {
		return (s === start || isAfter(s, start)) && (e === end || isBefore(e, end));
	}

	useEffect(() => {
		console.table(selection);
		//selection !== null && onSelection(selection[0][0], selection[0][1]);
	}, [selection]);

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

				{HOURS.map((hour, h) => (
					<React.Fragment key={hour}>
						<div className='very-small'>{hour}</div>
						{new Array(DAYS.length).fill(null).map((_, wd: number) => (
							<Slot key={wd} start={columnDate(wd, h)} end={columnDate(wd, h + 1)} />
						))}
					</React.Fragment>
				))}
			</div>

			{/* <div className={cn(s.grid, s.bookings)}>
				{data?.map(({ id, start, end }) => (
					<Slot key={id} state='unavailable' start={start} end={end} />
				))}
			</div>

			<div className={cn(s.grid, s.selection)}>
				{selection && <Slot state={'you'} start={selection[0]} end={selection[1]} />}
			</div> */}
		</div>
	);
}
