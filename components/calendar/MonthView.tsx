import {
	addDays,
	differenceInCalendarWeeks,
	formatDate,
	getHours,
	getWeek,
	isAfter,
	isBefore,
	isSameDay,
	isToday,
	lastDayOfMonth,
	startOfDay,
	startOfMonth,
	subDays,
} from 'date-fns';
import { sv } from 'date-fns/locale';
import s from './MonthView.module.scss';
import cn from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
import { DAYS, END_HOUR, HOURS_PER_DAY, START_HOUR } from '@/lib/constants';
import { formatSlotDateRange, getWeekday, tzDate } from '@/lib/dates';
import { groupBookingSlots, GroupSlot } from '@/lib/utils';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';

export type CalendarProps = {
	userId?: string;
	visible: boolean;
	mode: 'view' | 'edit';
};

type TooltipData = {
	day: Date;
	state: GroupSlot['state'];
	x: number;
	y: number;
	bookings: AllBookingsSearchQuery['allBookings'];
} | null;

export function MonthView({ userId, visible, mode }: CalendarProps) {
	const [selection, bookings, range, setView] = useBookingCalendarStore(
		useShallow((state) => [state.selection, state.bookings, state.range, state.setView]),
	);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [tooltip, setTooltip] = useState<TooltipData>(null);
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

	function handleHover(e: React.MouseEvent<HTMLDivElement>) {
		const week = e.currentTarget.dataset.week;
		const all = containerRef.current?.querySelectorAll(`[data-week]`);
		const slots = containerRef.current?.querySelectorAll(`[data-week="${week}"]`);

		all?.forEach((slot) => slot.classList.remove(s.hover));
		slots?.forEach((slot) => slot.classList.add(s.hover));
	}

	function handleSlotHover(
		e: React.MouseEvent<HTMLDivElement>,
		day: Date,
		state: GroupSlot['state'],
		allBookings: MonthSlotProps['bookings'],
	) {
		const rect = e.currentTarget.getBoundingClientRect();
		const containerRect = containerRef.current?.getBoundingClientRect();
		if (!containerRect) return;
		console.log(e.currentTarget);
		setTooltip({
			day,
			state,
			x: rect.left - containerRect.left + rect.width / 2,
			y: rect.top - containerRect.top,
			bookings: allBookings,
		});
	}

	function handleSlotLeave() {
		setTooltip(null);
	}

	const filteredBookings = useMemo(() => {
		if (!tooltip?.day || !tooltip?.bookings) return [];
		return tooltip.bookings.filter((b) => {
			const bookingStart = tzDate(b.start);
			const bookingEnd = tzDate(b.end);
			const hoverDay = startOfDay(tooltip.day);
			const nextDay = addDays(hoverDay, 1);

			if (bookingEnd <= hoverDay || bookingStart >= nextDay) return false;

			return true;
		});
	}, [tooltip?.day, tooltip?.bookings]);

	return (
		<div
			style={{ '--weeks': noWeeks, '--hours': 16 }}
			className={cn(s.month, !visible && s.hidden)}
			ref={containerRef}
			onMouseLeave={handleHover}
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
			{weeks.map((week, widx) => (
				<React.Fragment key={week}>
					<div
						className={cn(s.weekno, 'very-small')}
						data-week={week}
						style={{ gridRow: `${widx * 5 + 2} / span 5` }}
					>
						{week}
					</div>
					{new Array(DAYS.length).fill(null).map((_, idx: number) => {
						const now = tzDate(new Date());
						const slotStart = startOfDay(addDays(startDateOffset, widx * DAYS.length + idx));
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
								data-week={week}
								style={{
									gridColumnStart: idx + 2,
									gridColumnEnd: idx + 3,
									gridRowStart: widx * 5 + 2,
									gridRowEnd: `span 5`,
								}}
								onMouseEnter={handleHover}
								onMouseLeave={handleHover}
							>
								{formatDate(slotStart, 'd')}
							</div>
						);
					})}
				</React.Fragment>
			))}
			<div className={s.bookings}>
				{groupBookingSlots(bookings, userId)?.map((b, idx) => (
					<MonthSlot
						key={idx}
						{...b}
						range={range}
						userId={userId}
						onHover={handleSlotHover}
						onLeave={handleSlotLeave}
					/>
				))}
				{selection && (
					<MonthSlot
						start={selection[0]}
						end={selection[1]}
						state='selection'
						range={range}
						userId={userId}
						bookings={[]}
						onHover={handleSlotHover}
						onLeave={handleSlotLeave}
						hasOverlaps={false}
					/>
				)}
			</div>
			{tooltip && (
				<div className={cn('small', s.tooltip)} style={{ left: tooltip.x, top: tooltip.y }}>
					<div className={s.tooltipHeader}>{formatDate(tooltip.day, 'd MMMM', { locale: sv })}</div>
					{filteredBookings.map((b) => {
						const bookingStart = tzDate(b.start);
						const bookingEnd = tzDate(b.end);
						const hoverDay = startOfDay(tooltip.day);
						const nextDay = addDays(hoverDay, 1);

						const startsOnHoverDay = bookingStart >= hoverDay && bookingStart < nextDay;
						const endsOnHoverDay = bookingEnd > hoverDay && bookingEnd <= nextDay;
						const spansHoverDay = bookingStart < hoverDay && bookingEnd > nextDay;

						let timeRange: string;
						if (startsOnHoverDay && endsOnHoverDay) {
							timeRange = formatSlotDateRange(b.start, b.end);
						} else if (spansHoverDay) {
							timeRange = `${String(START_HOUR).padStart(2, '0')}:00 - ${String(END_HOUR).padStart(2, '0')}:00`;
						} else if (startsOnHoverDay) {
							timeRange = `${String(getHours(bookingStart)).padStart(2, '0')}:00 - ${String(END_HOUR).padStart(2, '0')}:00`;
						} else {
							timeRange = `${String(START_HOUR).padStart(2, '0')}:00 - ${String(getHours(bookingEnd)).padStart(2, '0')}:00`;
						}

						return (
							<p key={b.id} className={cn('very-small', s.tooltipItem)}>
								{timeRange}
								<br />
								{b.member.firstName} {b.member.lastName}
								<br />
								<span className={cn('very-small', s.equipment)}>
									{b.equipment.map((e) => e.titleShort || e.title).join(', ')}
								</span>
							</p>
						);
					})}
				</div>
			)}
		</div>
	);
}

type MonthSlotProps = GroupSlot & {
	range: [Date, Date];
	selection?: boolean;
	userId?: string;
	onHover?: (
		e: React.MouseEvent<HTMLDivElement>,
		day: Date,
		state: GroupSlot['state'],
		bookings: MonthSlotProps['bookings'],
	) => void;
	onLeave?: () => void;
};

const STATE_ROW_OFFSET: Record<GroupSlot['state'], number> = {
	unavailable: 1,
	shared: 2,
	you: 3,
	selection: 4,
};

function MonthSlot(props: MonthSlotProps) {
	const { range, state } = props;

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

	// Create a slot element for each week the booking spans
	const slots = [];
	const { onHover, onLeave } = props;
	for (let weekNum = startWeek; weekNum <= endWeek; weekNum++) {
		// Skip if this week is outside the calendar view
		if (weekNum < calendarStartWeek) continue;

		// Each week has 5 rows (1 for date + 4 for states), use calendar start as base
		const weekIndexInMonth = weekNum - calendarStartWeek;
		const gridRow = weekIndexInMonth * 5 + 1 + STATE_ROW_OFFSET[state];
		const startDayOfWeek = weekNum === startWeek ? getWeekday(bookingStart) : 1;
		const endDayOfWeek = weekNum === endWeek ? getWeekday(bookingEnd) : 7;

		const bookingStartHour = getHours(bookingStart);
		const bookingEndHour = getHours(bookingEnd);

		// Hours run from 07:00 to 23:00 (16 hours total)
		const isFirstWeek = weekNum === startWeek;
		const isLastWeek = weekNum === endWeek;
		const effectiveStartHour = isFirstWeek ? bookingStartHour : START_HOUR;
		const effectiveEndHour = isLastWeek ? bookingEndHour : END_HOUR;

		const gridColumnStart =
			(startDayOfWeek - 1) * HOURS_PER_DAY + (effectiveStartHour - START_HOUR) + 1;
		const gridColumnEnd = (endDayOfWeek - 1) * HOURS_PER_DAY + (effectiveEndHour - START_HOUR) + 1;

		const slotDay = startOfDay(addDays(calendarStart, weekIndexInMonth * 7 + (startDayOfWeek - 1)));

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
				onMouseEnter={(e) => onHover?.(e, slotDay, state, props.bookings)}
				onMouseLeave={onLeave}
			>
				<div />
			</div>,
		);
	}

	return <>{slots}</>;
}
