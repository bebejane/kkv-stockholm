import s from './WeekView.module.scss';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS } from '@/lib/constants';
import { addDays, addHours, differenceInDays, getWeek, isSameDay, startOfDay } from 'date-fns';
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
	const [start, end, data, selection, setSelection] = useBookingCalendarStore(
		useShallow((state) => [
			state.start,
			state.end,
			state.data,
			state.selection,
			state.setSelection,
		]),
	);
	const gridRef = useRef<HTMLDivElement | null>(null);
	const { selection: _selection, reset } = useSlotSelection({
		ref: gridRef,
		disable: disabled,
	});
	const [fullDays, setFullDays] = useState<Date[]>([]);
	const hours = HOURS.filter((_, h) => h >= START_HOUR && h < END_HOUR);

	function columnDate(wd: number, hour: number) {
		return addDays(addHours(start, hour), wd);
	}

	function handleFullDaySelection(evt: React.MouseEvent<HTMLDivElement>) {
		const t = evt.currentTarget as HTMLInputElement;
		const checked = t.checked;
		const date = startOfDay(tzDate(t.dataset.date as string));
		const start = addHours(date, START_HOUR);
		const end = addHours(date, END_HOUR);

		if (!fullDays.length) return setFullDays([start]);

		const first = fullDays.sort((a, b) => a.getTime() - b.getTime())[0];
		const last = fullDays.sort((a, b) => a.getTime() - b.getTime())[fullDays.length - 1];
		const insideRange =
			Math.abs(differenceInDays(start, first)) <= 1 && Math.abs(differenceInDays(end, last)) <= 1;

		if (checked) {
			setFullDays(!insideRange ? [start] : [...fullDays, start]);
		} else {
			setFullDays([]);
		}
	}

	useEffect(() => {
		_selection && setSelection?.(_selection ?? null);
	}, [_selection]);

	useEffect(() => {
		if (!fullDays.length) return setSelection(null);
		setSelection(null);
		const s = fullDays.sort((a, b) => a.getTime() - b.getTime())[0];
		const e = addHours(
			startOfDay(fullDays.sort((a, b) => a.getTime() - b.getTime())[fullDays.length - 1]),
			END_HOUR,
		);

		setSelection([s, e]);
	}, [fullDays]);

	return (
		<div className={cn(s.week, !visible && s.hidden, disabled && s.disabled)}>
			<div className={cn(s.grid, s.week)}>
				<div className={s.header}>v. {getWeek(start)}</div>
				{DAYS.map((d, i) => {
					const date = addDays(new Date(start), i);
					const title = capitalize(tzFormat(date, 'E dd'));
					return (
						<div className={cn(s.header, isToday(date) && s.today)} key={d}>
							{title}
						</div>
					);
				})}

				<div className={cn(s.header, s.fullday, 'small')}>Heldag</div>
				{DAYS.map((day, i) => {
					const now = startOfDay(tzDate(new Date()));
					const date = startOfDay(addDays(tzDate(new Date(start)), i));
					const dis = disabled || differenceInDays(date, now) < 1 || false;
					const checked = fullDays.find((d) => isSameDay(d, date)) ? true : false;

					return (
						<div className={cn(s.header, s.fullday, 'small')} key={day}>
							<Checkbox
								label={'Boka heldag'}
								size={'xs'}
								disabled={dis}
								checked={checked}
								onClick={handleFullDaySelection}
								data-date={date}
							/>
						</div>
					);
				})}

				<div className={cn(s.hours, 'very-small')}>
					{hours.map((hour, h) => (
						<div key={h} className='very-small'>
							{hour}
						</div>
					))}
				</div>
				<div className={s.sub} ref={gridRef}>
					{hours.map((hour, h) =>
						new Array(DAYS.length)
							.fill(null)
							.map((_, wd: number) => (
								<Slot
									key={wd}
									start={columnDate(wd, parseInt(hour))}
									end={columnDate(wd, parseInt(hour) + 1)}
									range={[start, end]}
									view='week'
								/>
							)),
					)}
				</div>
				<div className={cn(s.sub, s.bookings)}>
					{data?.map(({ id, start, end, note, equipment, member }) => (
						<Slot
							key={id}
							state={member.user === userId ? 'you' : 'unavailable'}
							start={start}
							end={end}
							range={[start, end]}
							view='week'
						>
							<>
								<h5>
									{member?.firstName} {member?.lastName}
								</h5>
								<p>
									{formatTimeRange(start, end)}
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
						<Slot
							state={'you'}
							start={selection[0]}
							end={selection[1]}
							range={[start, end]}
							view='week'
						/>
					)}
				</div>
			</div>
		</div>
	);
}
