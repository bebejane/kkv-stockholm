'use client';

import s from './Calender.module.scss';
import cn from 'classnames';
import { useState } from 'react';
import { format } from 'date-fns';

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

export function Calender() {
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
					<button className={s.back}>‹</button>
					<div className={s.views}>
						{views.map(({ id, title }) => (
							<button key={id} role='switch' aria-checked={id === view} data-id={id} onClick={handleViewClick}>
								{title}
							</button>
						))}
					</div>
					<button className={s.ffw}>›</button>
				</div>
				<button className={s.long} role='switch' aria-checked={longTerm} onClick={handleLongTermClick}>
					+ Långtidsbokning
				</button>
			</header>

			<div className={cn(s.interval, longTerm && s.show)}>
				<span>Välj tidsinterval för din långtidsbokning</span>
				<div className={s.range}>
					<div className={s.from}>
						<label htmlFor='from'>Startdatum</label>
						<input
							type='date'
							value={format(range?.[0] ?? today, 'yyyy-MM-dd')}
							onChange={(e) => setRange([new Date(e.target.value), range?.[1] ?? today])}
						/>
					</div>
					<div className={s.to}>
						<label htmlFor='from'>Slutdatum</label>
						<input
							type='date'
							value={format(range?.[1] ?? today, 'yyyy-MM-dd')}
							onChange={(e) => setRange([range?.[0] ?? today, new Date(e.target.value)])}
						/>
					</div>
				</div>
			</div>

			<div className={s.calendar}></div>
		</div>
	);
}
