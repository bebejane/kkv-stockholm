'use client';

import s from './index.module.scss';
import cn from 'classnames';
import { useState } from 'react';
import { format } from 'date-fns';
import { Button, Input, Box } from '@mantine/core';
import { Calender } from './Calender';
import data from './week.json';

type View = {
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

export default function Bookings() {
	const month = new Date();
	const today = new Date();
	const [view, setView] = useState<View['id']>('week');
	const [longTerm, setLongTerm] = useState<boolean>(false);
	const [range, setRange] = useState<[Date, Date] | null>(null);

	function handleViewClick(e: React.MouseEvent<HTMLButtonElement>) {
		const t = e.currentTarget as HTMLButtonElement;
		const id = t.dataset.id as View['id'];
		setView(id);
	}

	function handleLongTermClick(e: React.MouseEvent<HTMLButtonElement>) {
		const t = e.currentTarget as HTMLButtonElement;
		setLongTerm(!longTerm);
	}

	return (
		<div className={s.container}>
			<header>
				<div className={s.month}>{format(month, 'MMMM yyyy')}</div>
				<div className={s.selector}>
					<Button className={s.back}>‹</Button>
					<div className={s.views}>
						{views.map(({ id, title }) => (
							<Button
								key={id}
								role='switch'
								variant={id === view ? 'filled' : undefined}
								aria-checked={id === view}
								data-id={id}
								onClick={handleViewClick}
							>
								{title}
							</Button>
						))}
					</div>
					<Button className={s.ffw}>›</Button>
				</div>
				<Button
					className={s.long}
					role='switch'
					aria-checked={longTerm}
					variant={longTerm ? 'filled' : undefined}
					onClick={handleLongTermClick}
				>
					+ Långtidsbokning
				</Button>
			</header>

			<div className={cn(s.interval, longTerm && s.show)}>
				<span>Välj tidsinterval för din långtidsbokning</span>
				<div className={s.range}>
					<Input.Wrapper label='Startdatum:' className={s.date}>
						<Input
							type='date'
							name='from'
							value={format(range?.[0] ?? today, 'yyyy-MM-dd')}
							onChange={(e) => setRange([new Date(e.target.value), range?.[1] ?? today])}
						/>
					</Input.Wrapper>
					<Input.Wrapper label='Slutdatum:' className={s.date}>
						<Input
							type='date'
							name='to'
							value={format(range?.[1] ?? today, 'yyyy-MM-dd')}
							onChange={(e) => setRange([range?.[0] ?? today, new Date(e.target.value)])}
						/>
					</Input.Wrapper>
				</div>
			</div>
			<Calender data={data as any} />
		</div>
	);
}
