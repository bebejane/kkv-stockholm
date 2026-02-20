'use client';

import s from './Calendar.module.scss';
import cn from 'classnames';
import React, { Activity, CSSProperties, useRef } from 'react';
import { useEffect, useState } from 'react';
import { Button, ActionIcon, Loader } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { formatDateInput, formatMonthYear } from '@/lib/dates';
import { authClient } from '@/auth/auth-client';
import { useWindowSize } from 'react-use';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { useShallow } from './hooks/useSelectionStore';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';

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

export type BookingCalendarProps = {
	workshopId: string;
	equipmentIds: string[];
	disabled: boolean;
	ref?: React.RefObject<HTMLDivElement>;
};

export function Calendar({
	workshopId,
	equipmentIds,

	disabled: _disabled,
}: BookingCalendarProps) {
	const asideRef = useRef<HTMLDivElement>(null);
	const [longTerm, setLongTerm] = useState<boolean>(false);
	const [headerStyles, setHeaderStyles] = useState<CSSProperties | undefined>();
	const { width, height } = useWindowSize();
	const { data: session } = authClient.useSession();
	const disabled = !session?.user.id || _disabled;

	const [start, end, setRange, setView, next, prev, view, error, loading] = useBookingCalendarStore(
		useShallow((state) => [
			state.start,
			state.end,
			state.setRange,
			state.setView,
			state.next,
			state.prev,
			state.view,
			state.error,
			state.loading,
		]),
	);

	useEffect(() => {
		const asideHeight = asideRef.current?.getBoundingClientRect().height;
		setHeaderStyles({ marginTop: `-${asideHeight}px` });
	}, [width, height]);

	function handleViewChange(e: React.ChangeEvent<HTMLInputElement>) {
		const t = e.currentTarget as HTMLInputElement;
		setView(t.id as CalendarView['id']);
	}

	function handleLongTermClick(e: React.MouseEvent<HTMLButtonElement>) {
		const t = e.currentTarget as HTMLButtonElement;
		setLongTerm(!longTerm);
	}

	return (
		<div className={s.calendar}>
			<aside ref={asideRef}>
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
			<header style={headerStyles}>
				<div className={s.month}>{formatMonthYear(start)}</div>
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

				<div className={cn(s.longterm, disabled && s.hidden)}>
					<Button
						role='switch'
						aria-checked={longTerm}
						variant={'transparent'}
						onClick={handleLongTermClick}
					>
						+ Långtidsbokning
					</Button>
				</div>
			</header>

			<div className={cn(s.interval, longTerm && s.show)}>
				<div className={s.range}>
					<span>Från:</span>
					<DateTimePicker
						name='from'
						valueFormat='D MMM'
						value={formatDateInput(start)}
						onChange={(value) => value && setRange([new Date(value), end])}
					/>
					<span>Till:</span>
					<DateTimePicker
						name='to'
						valueFormat='D MMM'
						value={formatDateInput(end)}
						onChange={(value) => value && setRange([start, new Date(value)])}
					/>
				</div>
			</div>

			<div className={s.views}>
				<DayView userId={session?.user.id} disabled={disabled} visible={view === 'day'} />
				<WeekView userId={session?.user.id} disabled={disabled} visible={view === 'week'} />
				<MonthView userId={session?.user.id} disabled={disabled} visible={view === 'month'} />
				<Activity mode={loading ? 'visible' : 'hidden'}>
					<div className={s.loading}>
						<Loader color={'primaryLight'} />
					</div>
				</Activity>
			</div>

			{error && <div>{error}</div>}
		</div>
	);
}
