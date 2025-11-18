'use client';

import s from './Calender.module.scss';
import cn from 'classnames';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS, transformData } from './utils';

export type BookingHour = {
	start: string;
	end: string;
	b?: BookingRecord;
};

export type BookingDay = {
	name: string;
	hours: BookingHour[];
};

export type CalenderProps = {
	data: BookingDay[];
	workshop: WorkshopRecord;
	equipment: EquipmentRecord;
};

export function Calender({ data, workshop, equipment }: CalenderProps) {
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
					{columns[i].map(({ b }, idx) => (
						<div className={cn(s.column)} key={idx} data-type={b?.q}>
							{b && b.member?.name}
						</div>
					))}
				</div>
			))}
		</div>
	);
}
