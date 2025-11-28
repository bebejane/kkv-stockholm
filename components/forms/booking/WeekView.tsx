'use client';

import s from './WeekView.module.scss';
import cn from 'classnames';
import React, { CSSProperties } from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS, TZ } from '@/lib/constants';
import { CalendarView } from './Calender';
import { addDays, getDay, getWeek } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { capitalize } from 'next-dato-utils/utils';
import { sv } from 'date-fns/locale';
import { isToday } from 'date-fns';
import { tzDate } from '@/lib/dates';

export type WeekViewProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	start: Date;
	end: Date;
};

export function WeekView({ data, start, end }: WeekViewProps) {
	const [selection, setSelection] = React.useState<[Date, Date][] | null>(null);

	function handleSelection(e: React.MouseEvent<HTMLDivElement>) {
		const start = e.currentTarget.dataset.start;
		const end = e.currentTarget.dataset.end;
		//if (!start || !end) return;
		//setSelection((s) => s?.includes([start, end]) ? s?.filter(([s1, e1]) => s1 !== start || e1 !== end) : [...s, [start, end]]);
	}
	function columnStyle(start: Date, end: Date): CSSProperties {
		return {
			gridRow: start.getHours(),
			gridColumn: getDay(start),
		};
	}

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
						<div key={idx} data-start={tzDate(``)} date-end={tzDate(``)} onClick={handleSelection} />
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

			<div className={s.selection}>
				{selection?.map(([start, end], i) => (
					<div key={i} className={cn(s.c, s.you)} style={columnStyle(start, end)}>
						{' '}
					</div>
				))}
			</div>
		</div>
	);
}
