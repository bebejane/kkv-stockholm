import s from './Calender.module.scss';
import cn from 'classnames';
import React from 'react';
import { useEffect, useState } from 'react';
import { Button, ActionIcon } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useBookingCalender } from '@/components/forms/booking/useBookingCalender';
import { formatDate, formatDateInput, formatMonthYear } from '@/lib/dates';
import { Views } from '@/components/forms/booking/Views';

export type CalendarView = {
	id: 'day' | 'week' | 'month';
	title: string;
};

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

const status = [
	{ id: 'unavailable', title: 'Upptagen' },
	{ id: 'shared', title: 'Kan delas' },
	{ id: 'available', title: 'Ledig' },
	{ id: 'you', title: 'Din tid' },
];

export type BookingCalenderProps = {
	workshopId: string;
	equipmentIds: string[];
	onSelection: (start: Date, end: Date) => void;
};

export function Calender({ workshopId, equipmentIds, onSelection }: BookingCalenderProps) {
	const today = new Date();
	const [longTerm, setLongTerm] = useState<boolean>(false);
	const { start, end, setRange, next, prev, view, setView, data, error, loading } =
		useBookingCalender({
			workshopId,
			equipmentIds: equipmentIds ?? [],
		});

	function handleViewChange(e: React.ChangeEvent<HTMLInputElement>) {
		const t = e.currentTarget as HTMLInputElement;
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
		<div className={s.calender}>
			<aside>
				<h2>Förklaring</h2>
				<ul>
					{status.map(({ id, title }) => (
						<li key={id}>
							<div className={id} />
							<span>{title}</span>
						</li>
					))}
				</ul>
			</aside>
			<header>
				<div className={s.month}>
					{formatMonthYear(start)}
					<div style={{ fontSize: '0.8rem' }}>
						{formatDate(start)} till {formatDate(end)}
					</div>
				</div>
				<div className={s.selector}>
					<ActionIcon className={s.prev} variant={'white'} onClick={prev}>
						‹
					</ActionIcon>
					<div className={s.views}>
						{views.map(({ id, title }) => (
							<React.Fragment key={id}>
								<input
									id={id}
									key={id}
									type='radio'
									name={'view'}
									checked={id === view}
									onChange={handleViewChange}
								/>
								<label htmlFor={id}>{title}</label>
							</React.Fragment>
						))}
					</div>
					<ActionIcon className={s.ffw} variant={'white'} onClick={next}>
						›
					</ActionIcon>
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
						onChange={(value) => value && setRange([new Date(value), end])}
					/>
					<DatePickerInput
						name='to'
						value={formatDateInput(end)}
						variant={'unstyled'}
						onChange={(value) => value && setRange([start, new Date(value)])}
					/>
				</div>
			</div>
			<Views
				view={view}
				data={data}
				start={start}
				end={end}
				loading={loading}
				setView={setView}
				onSelection={onSelection}
			/>
			{error && <div>{error}</div>}
		</div>
	);
}
