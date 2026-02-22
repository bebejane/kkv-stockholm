'use client';

import s from './Calendar.module.scss';
import cn from 'classnames';
import React, { Activity, CSSProperties, useRef } from 'react';
import { useEffect, useState } from 'react';
import { Button, ActionIcon, Loader } from '@mantine/core';
import { DatePicker, DatePickerInput, DateTimePicker } from '@mantine/dates';
import { formatDateInput, formatMonthYear, tzDate } from '@/lib/dates';
import { authClient } from '@/auth/auth-client';
import { useWindowSize } from 'react-use';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { useShallow } from 'zustand/shallow';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import { difference } from 'next/dist/build/utils';
import { addHours, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { END_HOUR, START_HOUR } from '@/lib/constants';

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

export function Calendar({ workshopId, equipmentIds, disabled: _disabled }: BookingCalendarProps) {
	const asideRef = useRef<HTMLDivElement>(null);
	const [longTerm, setLongTerm] = useState<boolean>(false);
	const [longTermDate, setLongTermDate] = useState<{ start?: Date; end?: Date } | null>(null);
	const [headerStyles, setHeaderStyles] = useState<CSSProperties | undefined>();
	const { width, height } = useWindowSize();
	const isDesktop = useIsDesktop();
	const { data: session } = authClient.useSession();
	const disabled = !session?.user.id || _disabled;
	const activeViews = !isDesktop ? views.filter(({ id }) => id === 'day') : views;
	const [
		start,
		end,
		setSelection,
		setParams,
		setRange,
		setView,
		next,
		prev,
		view,
		error,
		setError,
		loading,
	] = useBookingCalendarStore(
		useShallow((state) => [
			state.start,
			state.end,
			state.setSelection,
			state.setParams,
			state.setRange,
			state.setView,
			state.next,
			state.prev,
			state.view,
			state.error,
			state.setError,
			state.loading,
		]),
	);

	// Reset selection on mount
	useEffect(() => {
		setSelection(null);
		setView('week');
	}, []);

	useEffect(() => setParams({ workshopId, equipmentIds }), [workshopId, equipmentIds]);
	useEffect(() => {
		const asideHeight = asideRef.current?.getBoundingClientRect().height;
		setHeaderStyles({ marginTop: `-${asideHeight}px` });
	}, [width, height]);

	useEffect(() => {
		if (!isDesktop) setView('day');
	}, [isDesktop]);

	function handleViewChange(e: React.ChangeEvent<HTMLInputElement>) {
		const t = e.currentTarget as HTMLInputElement;
		setView(t.id as CalendarView['id']);
	}

	function handleLongTermClick(e: React.MouseEvent<HTMLButtonElement>) {
		const t = e.currentTarget as HTMLButtonElement;
		setLongTerm(!longTerm);
	}

	function handleLongTermDateChange(value: string | null, type: 'from' | 'to') {
		if (!value) setLongTermDate({ start: undefined, end: undefined });
		const { start, end } = longTermDate ?? {};
		const date = addHours(startOfDay(tzDate(value)), type === 'from' ? START_HOUR : END_HOUR);

		if (type === 'from')
			setLongTermDate({
				start: date,
				end: end ? (isAfter(date, end) ? undefined : end) : undefined,
			});
		else if (type === 'to')
			setLongTermDate({
				start,
				end: date,
			});
	}

	useEffect(() => {
		if (!longTermDate) return;
		const { start, end } = longTermDate;
		if (!start || !end) return;
		setSelection([start, end]);
	}, [longTermDate]);

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
						{activeViews.map(({ id, title }) => (
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
					<DatePickerInput
						key={`${longTermDate?.start?.toISOString()}-start`}
						name='from'
						valueFormat='D MMM'
						placeholder={'Välj datum'}
						value={longTermDate?.start ?? undefined}
						onChange={(value) => handleLongTermDateChange(value, 'from')}
					/>
					<span>Till:</span>
					<DatePickerInput
						key={`${longTermDate?.end?.toISOString()}-end`}
						name='to'
						valueFormat='D MMM'
						placeholder={'Välj datum'}
						value={longTermDate?.end ?? undefined}
						minDate={longTermDate?.start ?? undefined}
						onChange={(value) => handleLongTermDateChange(value, 'to')}
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
			{error && (
				<div className={s.error}>
					<div className={s.dialog}>
						<h3>Ett fel uppstod</h3>
						<span>{error}</span>
						<Button onClick={() => setError(null)}>Stäng</Button>
					</div>
				</div>
			)}
		</div>
	);
}
