'use client';

import s from './Calender.module.scss';
import cn from 'classnames';
import { Checkbox } from '@mantine/core';
import { transformData } from './utils';
import { HOURS, DAYS } from '@/lib/constants';
import { BookingDay } from './types';
import React from 'react';
import { View } from './BookingCalender';

export type CalenderProps = {
	data: BookingDay[];
	view: View;
};

export function Calender({ data }: CalenderProps) {
	const columns = transformData(data);

	return (
		<div className={s.calendar}>
			<div className={cn(s.c)}>v. 43</div>
			{DAYS.map((day) => (
				<div className={cn(s.c)} key={day}>
					{day}
				</div>
			))}
			<div className={cn(s.c)}>Heldag</div>
			{DAYS.map((day) => (
				<div className={s.c} key={day}>
					<Checkbox label={'Boka heldag'} />
				</div>
			))}
			{HOURS.map((hour, i) => (
				<React.Fragment key={hour}>
					<div className={cn(s.c)}>{hour}</div>
					{columns[i].map(({ b }: { b: any }, idx: number) => (
						<div className={cn(s.c)} key={idx} data-type={b?.q}>
							{b && b.member?.name}
						</div>
					))}
				</React.Fragment>
			))}
		</div>
	);
}
