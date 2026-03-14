import s from './MonthView.module.scss';
import cn from 'classnames';
import React from 'react';
import { DAYS, END_HOUR, HOURS_PER_DAY, START_HOUR } from '@/lib/constants';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';
import { sv } from 'date-fns/locale';
import { getWeekday, isInsideRange, tzDate } from '@/lib/dates';
import {
	differenceInDays,
	differenceInHours,
	getHours,
	isAfter,
	isBefore,
	isSameDay,
	isToday,
	startOfDay,
	addDays,
	differenceInCalendarWeeks,
	formatDate,
	getWeek,
	lastDayOfMonth,
	startOfMonth,
	subDays,
} from 'date-fns';

export type CalendarProps = {
	userId?: string;
	visible: boolean;
	disabled: boolean;
};

export function MonthView({ userId, visible, disabled }: CalendarProps) {
	const [selection, bookings, range, setView] = useBookingCalendarStore(
		useShallow((state) => [state.selection, state.bookings, state.range, state.setView]),
	);

	const startDate = startOfMonth(range[0]);
	const endDate = lastDayOfMonth(range[1]);
	const startDateOffset = tzDate(startOfDay(subDays(startDate, getWeekday(startDate) - 1)));
	const endDateOffest = tzDate(addDays(endDate, 7 - getWeekday(endDate)));
	const startWeek = getWeek(startOfMonth(range[0]), { locale: sv });
	const noWeeks = differenceInCalendarWeeks(endDateOffest, startDateOffset, { locale: sv }) + 1;
	const weeks = new Array(noWeeks).fill(null).map((_, idx) => `V ${startWeek + idx}`);

	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		const date = e.currentTarget.dataset.date;
		if (!date) throw new Error('No start date on column set');
		setView('week', tzDate(date));
	}

	return (
		<div
			//@ts-ignore
			style={{ '--rows': noWeeks }}
			className={cn(s.month, !visible && s.hidden)}
		>
			<div className={s.header} />
			{DAYS.map((d, i) => {
				const date = addDays(startDateOffset, i);
				return (
					<div className={cn(s.header, isToday(date) && s.today)} key={d}>
						{d}
					</div>
				);
			})}
			{weeks.map((week, i) => (
				<React.Fragment key={week}>
					<div className={cn(s.weekno, 'very-small')}>{week}</div>
					{new Array(DAYS.length).fill(null).map((_, idx: number) => {
						const now = tzDate(new Date());
						const slotStart = startOfDay(addDays(startDateOffset, i * DAYS.length + idx));
						const disabled =
							isBefore(slotStart, startDate) ||
							isAfter(slotStart, endDate) ||
							isBefore(slotStart, now);

						return (
							<div
								role='button'
								key={idx}
								className={s.weekday}
								onClick={handleClick}
								data-date={slotStart}
								aria-disabled={disabled}
							>
								{formatDate(slotStart, 'd')}
							</div>
						);
					})}
				</React.Fragment>
			))}
			<div className={s.bookings}>
				{bookings
					?.filter(({ start, end }) => start && end && isInsideRange(range, [start, end]))
					.map((b) => {
						const noDays =
							differenceInDays(tzDate(startOfDay(b.end)), tzDate(startOfDay(b.start))) + 1;

						return new Array(noDays).fill(null).map((_, idx: number) => {
							const start = addDays(tzDate(b.start, idx > 0 ? START_HOUR : idx), idx);
							const end = isSameDay(b.start, tzDate(b.end))
								? tzDate(b.end)
								: tzDate(b.start, END_HOUR);
							return (
								<MonthSlot key={idx} {...b} range={range} userId={userId} start={start} end={end} />
							);
						});
					})}
				{selection && (
					<MonthSlot
						start={selection[0]}
						end={selection[1]}
						selection={true}
						range={range}
						userId={userId}
					/>
				)}
			</div>
		</div>
	);
}

type MonthSlotProps = Partial<AllBookingsSearchQuery['allBookings'][number]> & {
	range: [Date, Date];
	selection?: boolean;
	userId?: string;
};

function MonthSlot({ start, end, range, member, equipment, userId, selection }: MonthSlotProps) {
	const wd = getWeekday(start);
	const gridColumnStart = HOURS_PER_DAY * (wd - 1) + getHours(start) - START_HOUR + 1;
	const gridColumnEnd = gridColumnStart + differenceInHours(end, start);
	const gridRowStart =
		getWeek(start, { locale: sv }) - getWeek(startOfMonth(start), { locale: sv }) + 1;
	const gridRowEnd = gridRowStart;

	const state = selection
		? 'selection'
		: member?.user === userId
			? 'you'
			: equipment?.some((e) => e.exclusive)
				? 'unavailable'
				: 'shared';

	return (
		<div
			key={start.toISOString()}
			className={s.slot}
			data-start={tzDate(start)}
			data-end={tzDate(end)}
			data-range={range}
			data-state={state}
			style={{
				gridColumnStart,
				gridColumnEnd,
				gridRowStart,
				gridRowEnd,
			}}
		/>
	);
}
