'use client';

import s from './BookingCalender.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button, Input, Box } from '@mantine/core';
import { Calender } from './Calender';
import { DatePickerInput } from '@mantine/dates';
import { useBookingCalender } from '@/components/booking/useBookingCalender';
import { formatDate, formatDateInput, formatMonthYear } from '@/lib/utils';
import { CalendarView } from './types';
import React from 'react';

const views: CalendarView[] = [
	{
		id: 'day',
		title: 'Dag',
	},

	{
		id: 'week',
		title: 'Vecka',
	},
	{
		id: 'month',
		title: 'Månad',
	},
];

export type BookingCalenderProps = {
	workshopId?: string;
	equipmentIds?: string[];
};

export function BookingCalender({ workshopId, equipmentIds }: BookingCalenderProps) {
	const today = new Date();
	const [longTerm, setLongTerm] = useState<boolean>(false);
	const { start, end, setRange, next, prev, view, setView, data, error, loading } = useBookingCalender({
		workshopId,
		equipmentIds: equipmentIds ?? [],
	});

	function handleViewChange(e: React.ChangeEvent<HTMLInputElement>) {
		const t = e.currentTarget as HTMLInputElement;
		console.log(t.id);
		setView(t.id as CalendarView['id']);
	}

	function handleLongTermClick(e: React.MouseEvent<HTMLButtonElement>) {
		const t = e.currentTarget as HTMLButtonElement;
		setLongTerm(!longTerm);
	}

	useEffect(() => {
		console.log(view);
	}, [view]);

	return (
		<div className={s.container}>
			<header>
				<div className={s.month}>
					{formatMonthYear(start)}
					<div style={{ fontSize: '0.8rem' }}>
						{formatDate(start)} till {formatDate(end)}
					</div>
				</div>
				<div className={s.selector}>
					<Button className={s.back} variant={'white'} onClick={prev}>
						‹
					</Button>
					<div className={s.views}>
						{views.map(({ id, title }) => (
							<React.Fragment key={id}>
								<input id={id} key={id} type='radio' name={'view'} checked={id === view} onChange={handleViewChange} />
								<label htmlFor={id}>{title}</label>
							</React.Fragment>
						))}
					</div>
					<Button className={s.ffw} variant={'white'} onClick={next}>
						›
					</Button>
				</div>
				<Button
					className={s.long}
					role='switch'
					aria-checked={longTerm}
					variant={'transparent'}
					onClick={handleLongTermClick}
				>
					+ Långtidsbokning
				</Button>
			</header>

			<div className={cn(s.interval, longTerm && s.show)}>
				<span>Välj tidsinterval för din långtidsbokning</span>
				<div className={s.range}>
					<DatePickerInput
						name='from'
						value={formatDateInput(start)}
						variant={'unstyled'}
						onChange={(value) => value && setRange((r) => [new Date(value), r?.[1]])}
					/>

					<DatePickerInput
						name='to'
						value={formatDateInput(end)}
						variant={'unstyled'}
						onChange={(value) => value && setRange((r) => [r[0], new Date(value)])}
					/>
				</div>
			</div>
			<Calender view={view} data={data} start={start} end={end} />
			{loading && <div>Loading...</div>}
			{error && <div>{error}</div>}
		</div>
	);
}
