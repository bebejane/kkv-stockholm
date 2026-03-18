'use client';

import s from './Calendar.module.scss';
import cn from 'classnames';
import React, { Activity, CSSProperties, useRef } from 'react';
import { useEffect, useState } from 'react';
import { Button, ActionIcon, Loader, Checkbox } from '@mantine/core';
import { formatMonthYear } from '@/lib/dates';
import { authClient } from '@/auth/auth-client';
import { useWindowSize } from 'react-use';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { MonthView } from './MonthView';
import { useShallow } from 'zustand/shallow';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import { LongTermSelection } from './LongTermSelection';
import { sortSwedish } from 'next-dato-utils/utils';

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
	workshopId?: string;
	equipmentIds?: string[];
	allWorkshops?: AllWorkshopsQuery['allWorkshops'];
	hideAside?: boolean;
	mode: 'view' | 'edit';
	height?: string;
	ref?: React.RefObject<HTMLDivElement>;
};

export function Calendar({
	allWorkshops,
	workshopId: _workshopId,
	equipmentIds: _equipmentIds,
	hideAside,
	mode,
	height: _height,
}: BookingCalendarProps) {
	const [workshopId, setWorkshopId] = useState<string | undefined>(_workshopId);
	const [equipmentIds, setEquipmentIds] = useState<string[]>(_equipmentIds ?? []);
	const asideRef = useRef<HTMLDivElement>(null);
	const [longTerm, setLongTerm] = useState<boolean>(false);
	const [headerStyles, setHeaderStyles] = useState<CSSProperties | undefined>();
	const { width, height } = useWindowSize();
	const isDesktop = useIsDesktop();
	const { data: session, error: sessionError, isPending: sessionPending } = authClient.useSession();
	const disabled = !session?.user.id || mode === 'view';
	const activeViews = !isDesktop ? views.filter(({ id }) => id === 'day') : views;
	const workshop = allWorkshops?.find(({ id }) => id === workshopId);

	const [start, setSelection, setParams, setView, next, prev, view, error, setError, loading] =
		useBookingCalendarStore(
			useShallow((state) => [
				state.start,
				state.setSelection,
				state.setParams,
				state.setView,
				state.next,
				state.prev,
				state.view,
				state.error,
				state.setError,
				state.loading,
			]),
		);

	function handleViewChange(e: React.ChangeEvent<HTMLInputElement>) {
		const t = e.currentTarget as HTMLInputElement;
		setView(t.id as CalendarView['id']);
	}

	function handleLongTermClick(e: React.MouseEvent<HTMLButtonElement>) {
		const t = e.currentTarget as HTMLButtonElement;
		setLongTerm(!longTerm);
	}

	// Reset selection on mount
	useEffect(() => {
		setSelection(null);
		setView('week');
	}, []);

	useEffect(() => {
		setWorkshopId(_workshopId);
		setEquipmentIds(_equipmentIds ?? []);
	}, [_workshopId, _equipmentIds]);

	useEffect(() => {
		if (!workshopId) return;

		setParams({ workshopId, equipmentIds });
	}, [workshopId, equipmentIds]);

	useEffect(() => {
		const asideHeight = asideRef.current?.getBoundingClientRect().height;
		setHeaderStyles({ marginTop: `-${asideHeight}px` });
	}, [width, height]);

	useEffect(() => {
		setView(isDesktop ? 'week' : 'day');
	}, [isDesktop]);

	return (
		<div className={s.calendar} style={{ '--height': _height }}>
			{!hideAside && (
				<aside ref={asideRef}>
					<h2>Förklaring</h2>
					<ul className={s.state}>
						{status.map(({ id, title }) => (
							<li key={id}>
								<div className={id} />
								<span>{title}</span>
							</li>
						))}
					</ul>
					{workshop && (
						<>
							<h2>Utrustning</h2>
							<ul className={s.equipment}>
								{sortSwedish(workshop.equipment, 'title').map(({ id, title }) => (
									<li key={id}>
										<Checkbox
											checked={equipmentIds.includes(id)}
											label={title}
											onChange={({ currentTarget: { checked } }) =>
												setEquipmentIds((prev) =>
													prev.includes(id) && !checked
														? prev.filter((i) => i !== id)
														: [...prev, id],
												)
											}
										/>
									</li>
								))}
							</ul>
						</>
					)}
				</aside>
			)}
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

			<LongTermSelection
				show={longTerm}
				workshopId={workshopId}
				equipmentIds={equipmentIds}
				onUnavailable={() => setError('Tiden är ej tillgänglig')}
			/>

			<div className={s.container}>
				<DayView userId={session?.user.id} disabled={disabled} visible={view === 'day'} />
				<WeekView userId={session?.user.id} disabled={disabled} visible={view === 'week'} />
				<MonthView userId={session?.user.id} disabled={disabled} visible={view === 'month'} />
				<Activity mode={loading ? 'visible' : 'hidden'}>
					<div className={s.loading}>
						<Loader key={loading ? 'loading' : 'silent'} color='primaryLight' />
					</div>
				</Activity>
			</div>

			{error && (
				<div className={s.error}>
					<div className={s.dialog}>
						<h3>Ett fel uppstod</h3>
						<p>{error}</p>
						<Button onClick={() => setError(null)} fullWidth={true} variant={'outline'}>
							Stäng
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
