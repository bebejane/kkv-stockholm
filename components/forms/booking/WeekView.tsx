'use client';

import s from './WeekView.module.scss';
import cn from 'classnames';
import React, { CSSProperties, useState } from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS } from '@/lib/constants';
import { addDays, addHours, getDay, getWeek, isAfter, isBefore } from 'date-fns';
import { capitalize } from 'next-dato-utils/utils';
import { isToday } from 'date-fns';
import { tzDate, tzFormat } from '@/lib/dates';

export type WeekViewProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	start: Date;
	end: Date;
};

export function WeekView({ data, start, end }: WeekViewProps) {
	const [selection, setSelection] = useState<[Date, Date][]>([]);

	function handleSelection(e: React.MouseEvent<HTMLDivElement>) {
		const date = e.currentTarget.dataset.date;
		if (!date) throw new Error('No start date on column set');
		const start = tzDate(date);
		const end = addHours(start, 1);
		const range: [Date, Date] = [start, end];
		// setSelection((ranges) => {
		// 	return ranges.find(([s1, e1]) => s1 === start && e1 === end) ? ranges : [...ranges, range];
		// });
		setSelection([range]);
	}

	function columnStyle(s: Date, e: Date): CSSProperties {
		const offset = 1;

		return {
			gridColumn: getDay(s) + offset,
			gridRow: e.getHours() + offset,
		};
	}

	function columnDate(wd: number, hour: number) {
		return addDays(addHours(start, hour), wd).toISOString();
	}

	function filterSelection([s, e]: [Date, Date]) {
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

				<div>Heldag</div>
				{DAYS.map((day) => (
					<div key={day}>
						<Checkbox label={'Boka heldag'} size={'xs'} />
					</div>
				))}

				{HOURS.map((hour, h) => (
					<React.Fragment key={hour}>
						<div>{hour}</div>
						{new Array(DAYS.length).fill(null).map((_, wd: number) => (
							<div key={wd} data-date={columnDate(wd, h + 1)} onClick={handleSelection} />
						))}
					</React.Fragment>
				))}
			</div>

			<div className={cn(s.grid, s.bookings)}>
				{data?.map(({ id, start, end }) => (
					<div key={id} className={cn(s.c, 'unavail')} style={{ gridRow: 3, gridColumn: 2 }}>
						{' '}
					</div>
				))}
			</div>

			<div className={cn(s.grid, s.selection)}>
				{selection?.filter(filterSelection).map(([start, end], i) => (
					<div key={i} className={cn(s.c, 'you')} style={columnStyle(start, end)}>
						{' '}
					</div>
				))}
			</div>
		</div>
	);
}
