import s from './WeekView.module.scss';
import cn from 'classnames';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS, TZ } from '@/lib/constants';
import { addDays, endOfDay, getWeek, isBefore, isSameDay, startOfDay } from 'date-fns';
import { capitalize } from 'next-dato-utils/utils';
import { isToday } from 'date-fns';
import { formatSlotDateRange, isInsideRange, isTouchingRange, tzDate, tzFormat } from '@/lib/dates';
import { useSlotSelection } from './hooks/useSlotSelection';
import { END_HOUR, START_HOUR } from '@/lib/constants';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';
import { groupBookingSlots } from '@/lib/utils';
import { WeekSlot } from './WeekSlot';

export type WeekViewProps = {
	userId?: string;
	visible: boolean;
	disabled: boolean;
};

export function WeekView({ userId, visible, disabled }: WeekViewProps) {
	const gridRef = useRef<HTMLDivElement | null>(null);
	const [fullDays, setFullDays] = useState<Date[] | null>(null);
	const hours = HOURS.filter((_, h) => h >= START_HOUR && h < END_HOUR);
	const [range, bookings, selection, setSelection, setView, params] = useBookingCalendarStore(
		useShallow((state) => [
			state.range,
			state.bookings,
			state.selection,
			state.setSelection,
			state.setView,
			state.params,
		]),
	);
	const { selection: _selection, reset } = useSlotSelection({
		ref: gridRef,
		disable: disabled,
		onSelect: (selection) => setFullDays(null),
		range,
		bookings,
		key: process.env.NODE_ENV === 'development' ? Math.random().toString() : undefined,
	});

	function columnDate(wd: number, hour: number) {
		return addDays(tzDate(range[0], hour), wd);
	}

	function isValidFullDaySelection(date: Date) {
		const now = tzDate();
		const range: [Date, Date] = [tzDate(date, START_HOUR), tzDate(date, END_HOUR)];
		if (isBefore(date, now)) return false;
		if (bookings?.some((b) => isTouchingRange(range, [b.start, b.end]))) return false;
		if (!fullDays?.length) return true;

		const first = addDays(
			startOfDay(fullDays.sort((a, b) => (a.getTime() - b.getTime() ? 1 : -1))[0]),
			-1,
		);
		const last = addDays(
			endOfDay(fullDays.sort((a, b) => (a.getTime() - b.getTime() ? 1 : -1))[fullDays.length - 1]),
			1,
		);

		const fullRange: [Date, Date] = [first, last];
		return isInsideRange(fullRange, range);
	}

	function handleFullDaySelection(evt: React.MouseEvent<HTMLDivElement>) {
		const { checked, dataset } = evt.currentTarget as HTMLInputElement;
		const date = tzDate(dataset.date as string, START_HOUR);
		const valid = isValidFullDaySelection(date);
		const first = startOfDay(
			fullDays?.sort((a, b) => (a.getTime() - b.getTime() ? 1 : -1))[0] ?? date,
		);
		const last = startOfDay(
			fullDays?.sort((a, b) => (a.getTime() - b.getTime() ? 1 : -1))[fullDays.length - 1] ?? date,
		);

		if (!valid) return setFullDays([date]);

		if (checked) {
			setFullDays([...(fullDays ?? []), date]);
		} else {
			if (isSameDay(first, date) || isSameDay(last, date))
				return setFullDays(fullDays?.filter((d) => !isSameDay(d, date)) ?? null);
			setFullDays([date]);
		}
	}

	function handleWeekdayClick(e: React.MouseEvent<HTMLDivElement>) {
		const date = startOfDay(tzDate(e.currentTarget.dataset.date as string));
		setView('day', tzDate(date));
	}

	useEffect(() => {
		if (!fullDays) return;
		if (fullDays?.length === 0) return setSelection(null);

		const s = fullDays.sort((a, b) => a.getTime() - b.getTime())[0];
		const e = tzDate(
			startOfDay(fullDays.sort((a, b) => a.getTime() - b.getTime())[fullDays.length - 1]),
			END_HOUR,
		);

		setSelection([s, e]);
	}, [fullDays]);

	useEffect(() => {
		setSelection?.(_selection ?? null);
	}, [_selection]);

	useEffect(() => {
		!selection && setFullDays(null);
	}, [selection]);

	//console.log(groupBookingSlots(bookings));

	return (
		<div className={cn(s.week, !visible && s.hidden, disabled && s.disabled)}>
			<div className={cn(s.grid, s.week)} data-hide-fulldays={disabled}>
				<div className={s.header}>v. {getWeek(range[0])}</div>
				{DAYS.map((d, i) => {
					const date = addDays(range[0], i);
					const day = capitalize(tzFormat(date, 'E dd'));
					return (
						<div
							className={cn(s.header, isToday(date) && s.today)}
							key={d}
							role='button'
							data-date={date}
							onClick={handleWeekdayClick}
						>
							{day}
						</div>
					);
				})}

				{!disabled && (
					<>
						<div className={cn(s.header, s.fullday, 'small')}>Heldag</div>
						{DAYS.map((_, i) => {
							const date = startOfDay(addDays(tzDate(range[0]), i));
							const checked = fullDays?.find((d) => isSameDay(d, date)) ? true : false;

							return (
								<div className={cn(s.header, s.fullday, 'small')} key={date.toISOString()}>
									<Checkbox
										label={'Boka heldag'}
										size={'xs'}
										disabled={disabled || !isValidFullDaySelection(date)}
										checked={checked}
										onClick={handleFullDaySelection}
										data-date={date}
										className={s.checkbox}
									/>
								</div>
							);
						})}
					</>
				)}

				<div className={cn(s.hours, 'very-small')}>
					{hours.map((hour, h) => (
						<div key={h} className='very-small'>
							{hour}
						</div>
					))}
				</div>
				<div className={s.sub} ref={gridRef}>
					{hours.map((hour) =>
						new Array(DAYS.length)
							.fill(null)
							.map((_, wd: number) => (
								<WeekSlot
									key={wd}
									start={columnDate(wd, parseInt(hour))}
									end={columnDate(wd, parseInt(hour) + 1)}
									range={range}
									index={0}
								/>
							)),
					)}
				</div>
				<div className={cn(s.sub, s.bookings)}>
					{groupBookingSlots(bookings, userId)?.map(({ start, end, bookings, state }, idx) => {
						return (
							<WeekSlot key={idx} state={state} start={start} end={end} range={range} index={idx}>
								{bookings.map(({ start, end, note, equipment, member }, idx) => (
									<React.Fragment key={idx}>
										<h5>
											{member?.firstName} {member?.lastName}
										</h5>
										<p>
											{formatSlotDateRange(start, end)}
											<br />
											{equipment?.map(({ title }, idx) => (
												<React.Fragment key={idx}>
													{title}
													<br />
												</React.Fragment>
											))}
											{note && <>"{note}"</>}
										</p>
									</React.Fragment>
								))}
							</WeekSlot>
						);
					})}
				</div>
				<div className={cn(s.sub, s.selection)}>
					{selection && (
						<WeekSlot
							state={'selection'}
							start={selection[0]}
							end={selection[1]}
							range={range}
							index={0}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
