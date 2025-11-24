'use client';

import s from './BookingCalender.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button, Input, Box } from '@mantine/core';
import { Calender } from './Calender';
import data from './week.json';
import { DateInput, DatePickerInput } from '@mantine/dates';
import { useBookingCalender } from '@/components/booking/useBookingCalender';
import { MemberUserSession } from '@/auth/utils';
import { WorkshopType, WorkshopTypeLinked } from '@/lib/controller/workshop';
import { EquipmentType } from '@/lib/controller/equipment';

export type View = {
	id: 'day' | 'week' | 'month';
	title: string;
};

const views: View[] = [
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
	workshop: AllWorkshopsQuery['allWorkshops'][0];
	equipment: AllWorkshopsQuery['allWorkshops']['0']['equipment'][0];
};

export function BookingCalender({ workshop, equipment }: BookingCalenderProps) {
	const today = new Date();
	const [longTerm, setLongTerm] = useState<boolean>(false);
	const { view, setView, range, setRange, data, authorized, error, loading } = useBookingCalender({
		view: 'week',
		workshopId: workshop.id,
		equipmentId: equipment.id,
		range: [today, today],
	});

	function handleViewClick(e: React.MouseEvent<HTMLButtonElement>) {
		const t = e.currentTarget as HTMLButtonElement;
		const id = t.dataset.id as View['id'];
		setView(id);
	}

	function handleLongTermClick(e: React.MouseEvent<HTMLButtonElement>) {
		const t = e.currentTarget as HTMLButtonElement;
		setLongTerm(!longTerm);
	}

	useEffect(() => {
		console.log(view);
	}, [view]);

	console.log(data, loading);

	return (
		<div className={s.container}>
			<header>
				<div className={s.month}>{format(today, 'MMMM yyyy')}</div>
				<div className={s.selector}>
					<Button className={s.back} variant={'white'}>
						‹
					</Button>
					<div className={s.views}>
						{views.map(({ id, title }) => (
							<Button
								key={id}
								role='switch'
								variant={'transparent'}
								aria-checked={id === view}
								data-id={id}
								onClick={handleViewClick}
							>
								{title}
							</Button>
						))}
					</div>
					<Button className={s.ffw} variant={'white'}>
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
						value={format(range?.[0] ?? today, 'yyyy-MM-dd')}
						variant={'unstyled'}
						onChange={(value) => value && setRange((r) => [new Date(value), r[1] ?? today])}
					/>

					<DatePickerInput
						name='to'
						value={format(range?.[1] ?? today, 'yyyy-MM-dd')}
						variant={'unstyled'}
						onChange={(value) => value && setRange((r) => [r?.[0] ?? today, new Date(value)])}
					/>
				</div>
			</div>
			{loading && <div>Loading...</div>}
			{error && <div>{error}</div>}
			{/* <Calender data={data as any} /> */}
		</div>
	);
}
