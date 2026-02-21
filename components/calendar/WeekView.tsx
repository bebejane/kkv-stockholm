import s from './WeekView.module.scss';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS } from '@/lib/constants';
import { addDays, addHours, endOfDay, getWeek, isBefore, isSameDay, startOfDay } from 'date-fns';
import { capitalize } from 'next-dato-utils/utils';
import { isToday } from 'date-fns';
import { formatTimeRange, isInsideRange, isOutsideRange, tzDate, tzFormat } from '@/lib/dates';
import { Slot } from './Slot';
import { useSlotSelection } from './hooks/useSlotSelection';
import { END_HOUR, START_HOUR } from '@/lib/constants';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';

export type WeekViewProps = {
	userId?: string;
	visible: boolean;
	disabled: boolean;
};

export function WeekView({ userId, visible, disabled }: WeekViewProps) {
	const [view, range, data, selection, setSelection] = useBookingCalendarStore(
		useShallow((state) => [
			state.view,
			state.range,
			state.data,
			state.selection,
			state.setSelection,
		]),
	);
	const gridRef = useRef<HTMLDivElement | null>(null);
	const { selection: _selection, reset } = useSlotSelection({
		ref: gridRef,
		disable: disabled,
		onSelect: (selection) => setFullDays(null),
	});
	const [fullDays, setFullDays] = useState<Date[] | null>(null);
	const hours = HOURS.filter((_, h) => h >= START_HOUR && h < END_HOUR);

	function columnDate(wd: number, hour: number) {
		return addDays(addHours(range[0], hour), wd);
	}

	function isValidFullDaySelection(date: Date) {
		const now = tzDate(new Date());
		if (isBefore(date, now)) return false;
		if (!fullDays?.length) return true;

		const first = addDays(
			startOfDay(fullDays.sort((a, b) => (a.getTime() - b.getTime() ? 1 : -1))[0]),
			-1,
		);
		const last = addDays(
			endOfDay(fullDays.sort((a, b) => (a.getTime() - b.getTime() ? 1 : -1))[fullDays.length - 1]),
			1,
		);
		const range: [Date, Date] = [first, last];
		return isInsideRange(range, [date, date]);
	}

	function handleFullDaySelection(evt: React.MouseEvent<HTMLDivElement>) {
		const t = evt.currentTarget as HTMLInputElement;
		const { checked } = t;
		const date = startOfDay(tzDate(t.dataset.date as string));
		const start = addHours(date, START_HOUR);
		const valid = isValidFullDaySelection(date);
		const first = startOfDay(
			fullDays?.sort((a, b) => (a.getTime() - b.getTime() ? 1 : -1))[0] ?? date,
		);
		const last = startOfDay(
			fullDays?.sort((a, b) => (a.getTime() - b.getTime() ? 1 : -1))[fullDays.length - 1] ?? date,
		);

		if (!valid) return setFullDays([start]);

		if (checked) {
			setFullDays([...(fullDays ?? []), start]);
		} else {
			if (isSameDay(first, date) || isSameDay(last, date))
				return setFullDays(fullDays?.filter((d) => !isSameDay(d, date)) ?? null);
			setFullDays([start]);
		}
	}

	useEffect(() => {
		_selection && setSelection?.(_selection ?? null);
	}, [_selection]);

	useEffect(() => {
		if (!fullDays) return;
		if (fullDays?.length === 0) return setSelection(null);

		const s = fullDays.sort((a, b) => a.getTime() - b.getTime())[0];
		const e = addHours(
			startOfDay(fullDays.sort((a, b) => a.getTime() - b.getTime())[fullDays.length - 1]),
			END_HOUR,
		);

		setSelection([s, e]);
	}, [fullDays]);

	return (
		<div className={cn(s.week, !visible && s.hidden, disabled && s.disabled)}>
			<div className={cn(s.grid, s.week)} data-hide-fulldays={disabled}>
				<div className={s.header}>v. {getWeek(range[0])}</div>
				{DAYS.map((d, i) => {
					const date = addDays(range[0], i);
					const title = capitalize(tzFormat(date, 'E dd'));
					return (
						<div className={cn(s.header, isToday(date) && s.today)} key={d}>
							{title}
						</div>
					);
				})}

				{!disabled && (
					<>
						<div className={cn(s.header, s.fullday, 'small')}>Heldag</div>
						{DAYS.map((_, i) => {
							const date = startOfDay(addDays(tzDate(tzDate(range[0])), i));
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
								<Slot
									key={wd}
									start={columnDate(wd, parseInt(hour))}
									end={columnDate(wd, parseInt(hour) + 1)}
									range={range}
									view='week'
								/>
							)),
					)}
				</div>
				<div className={cn(s.sub, s.bookings)}>
					{data?.map(({ id, start: _start, end: _end, note, equipment, member }) => (
						<Slot
							key={id}
							state={member.user === userId ? 'you' : 'unavailable'}
							start={_start}
							end={_end}
							range={range}
							view='week'
						>
							<>
								<h5>
									{member?.firstName} {member?.lastName}
								</h5>
								<p>
									{formatTimeRange(_start, _end)}
									<br />
									{equipment?.map(({ title }) => title).join(', ')}
									{note && (
										<>
											<br />"{note}"
										</>
									)}
								</p>
							</>
						</Slot>
					))}
				</div>
				<div className={cn(s.sub, s.selection)}>
					{selection && (
						<Slot state={'you'} start={selection[0]} end={selection[1]} range={range} view='week' />
					)}
				</div>
			</div>
		</div>
	);
}
