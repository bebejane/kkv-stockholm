import s from './MonthView.module.scss';
import cn from 'classnames';
import React from 'react';
import { DAYS, HOURS_PER_DAY, START_HOUR } from '@/lib/constants';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';
import { sv } from 'date-fns/locale';
import { formatDateTimeRange, getWeekday, tzDate } from '@/lib/dates';
import {
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
	const endDateOffset = tzDate(addDays(endDate, 7 - getWeekday(endDate)));
	const startWeek = getWeek(startOfMonth(range[0]), { locale: sv });
	const noWeeks = differenceInCalendarWeeks(endDateOffset, startDateOffset, { locale: sv }) + 1;
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
				{bookings?.map((b, idx) => (
					<MonthSlot key={idx} {...b} range={range} userId={userId} />
				))}
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

function MonthSlot(props: MonthSlotProps) {
	const { range, member, userId, selection, equipment } = props;

	// Calculate the calendar grid boundaries
	const firstDayOfMonth = startOfMonth(range[0]);
	const lastDay = lastDayOfMonth(range[1]);
	const calendarStart = tzDate(
		startOfDay(subDays(firstDayOfMonth, getWeekday(firstDayOfMonth) - 1)),
	);
	const calendarEnd = tzDate(addDays(lastDay, 7 - getWeekday(lastDay)));

	// Clip booking to visible calendar range
	const bookingStart = isBefore(props.start, calendarStart) ? calendarStart : tzDate(props.start);
	const bookingEnd = isAfter(props.end, calendarEnd) ? calendarEnd : tzDate(props.end);

	// Calculate how many weeks the booking spans
	const startWeek = getWeek(bookingStart, { locale: sv });
	const endWeek = getWeek(bookingEnd, { locale: sv });
	const calendarStartWeek = getWeek(calendarStart, { locale: sv });

	const state = selection
		? 'selection'
		: member?.user === userId
			? 'you'
			: equipment?.some((e) => e.exclusive)
				? 'unavailable'
				: 'shared';

	// Create a slot element for each week the booking spans
	const slots = [];
	for (let weekNum = startWeek; weekNum <= endWeek; weekNum++) {
		// Skip if this week is outside the calendar view
		if (weekNum < calendarStartWeek) continue;

		// Calculate grid positions (day-based, not hour-based)
		const gridRow = weekNum - calendarStartWeek + 1; // +2 because row 1 is header
		const startDayOfWeek = weekNum === startWeek ? getWeekday(bookingStart) : 1;
		const endDayOfWeek = weekNum === endWeek ? getWeekday(bookingEnd) : 7;

		// For month view, we need to account for hours within the day grid
		// Each day has HOURS_PER_DAY columns in the grid
		const startHour =
			weekNum === startWeek && isSameDay(bookingStart, props.start)
				? getHours(props.start) - START_HOUR
				: 0;
		const endHour =
			weekNum === endWeek && isSameDay(bookingEnd, props.end)
				? Math.min(getHours(props.end) - START_HOUR, HOURS_PER_DAY)
				: HOURS_PER_DAY;

		// Calculate column positions with hourly precision
		const gridColumnStart = (startDayOfWeek - 1) * HOURS_PER_DAY + startHour + 1;
		const gridColumnEnd = (endDayOfWeek - 1) * HOURS_PER_DAY + endHour + 1;

		slots.push(
			<div
				key={weekNum}
				className={s.slot}
				data-start={props.start}
				data-end={props.end}
				data-state={state}
				style={{
					gridColumnStart,
					gridColumnEnd,
					gridRowStart: gridRow,
					gridRowEnd: gridRow + 1,
				}}
			/>,
		);
	}

	return <>{slots}</>;
}
