'use client';

import s from './Calender.module.scss';
import cn from 'classnames';
import { Checkbox } from '@mantine/core';
import { transformData } from './utils';
import { HOURS, DAYS } from '@/lib/constants';
import { BookingDay } from './types';

export type CalenderProps = {
	data: BookingDay[];
};

export function Calender({ data }: CalenderProps) {
	const columns = transformData(data);

	return (
		<div className={s.calendar}>
			<div className={cn(s.row)}>
				<div className={cn(s.column)}>v. 43</div>
				{DAYS.map((day) => (
					<div className={s.column} key={day}>
						{day}
					</div>
				))}
			</div>
			<div className={cn(s.row)}>
				<div className={cn(s.column)}>Heldag</div>
				{DAYS.map((day) => (
					<div className={s.column} key={day}>
						<Checkbox label={'Boka heldag'} />
					</div>
				))}
			</div>
			{HOURS.map((hour, i) => (
				<div className={cn(s.row)} key={hour}>
					<div className={cn(s.column)}>{hour}</div>
					{columns[i].map(({ b }: { b: any }, idx: number) => (
						<div className={cn(s.column)} key={idx} data-type={b?.q}>
							{b && b.member?.name}
						</div>
					))}
				</div>
			))}
		</div>
	);
}
