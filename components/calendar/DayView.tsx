import s from './DayView.module.scss';
import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { HOURS, START_HOUR, END_HOUR } from '@/lib/constants';
import { isBefore, isToday } from 'date-fns';
import { DaySlot } from './DaySlot';
import { formatSlotDateRange, isTouchingRange, tzDate, tzFormat } from '@/lib/dates';
import { useSlotSelection } from './hooks/useSlotSelection';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';
import React from 'react';
import { getBookingState } from '@/lib/utils';

export type DayViewProps = {
	userId?: string;
	visible: boolean;
	mode: 'view' | 'edit';
};

export function DayView({ userId, visible, mode }: DayViewProps) {
	const [range, bookings, selection, setSelection, params] = useBookingCalendarStore(
		useShallow((state) => [
			state.range,
			state.bookings,
			state.selection,
			state.setSelection,
			state.params,
		]),
	);

	const gridRef = useRef<HTMLDivElement | null>(null);
	const { selection: _selection } = useSlotSelection({
		ref: gridRef,
		disable: mode === 'view',
		range,
		bookings,
	});

	useEffect(() => {
		_selection && setSelection(_selection);
	}, [_selection]);

	const title = tzFormat(range[0], 'EEEE dd');
	const today = isToday(tzDate(range[0]));
	const now = tzDate();
	const hours = HOURS.filter((_, h) => h >= START_HOUR && h < END_HOUR);
	const columnOffset = mode === 'edit' ? 1 : 0;
	const columns = bookings?.length || 0;

	return (
		<div
			className={cn(s.day, !visible && s.hidden)}
			style={{
				'--columns': columns + columnOffset,
				// On mobile, show the select column (+ any offset) plus two
				// booking columns per viewport; the rest scroll horizontally.
				'--columns-visible': columnOffset + 2,
			}}
		>
			<div className={cn(s.header, today && s.today)}>{title}</div>
			<div className={s.hours}>
				{hours.map((hour, h) => (
					<div className='very-small' key={hour}>
						{hour}
					</div>
				))}
			</div>
			{/*
				The cell grid. On mobile this is the horizontal scroll container;
				the booking and selection overlays live inside it as in-flow
				subgrid layers, so they share the exact tracks and scroll with it.
			*/}
			<div className={s.sub} ref={gridRef}>
				{hours.map((hour) =>
					new Array(columns + columnOffset).fill(null).map((_, col: number) => {
						const start = tzDate(range[0], parseInt(hour));
						const end = tzDate(range[0], parseInt(hour) + 1);
						// Column col belongs to booking (col - columnOffset); the
						// select column (edit mode) has no booking of its own.
						const bookingIndex = col - columnOffset;
						const ownBooking =
							bookingIndex >= 0 && bookings ? bookings[bookingIndex] : undefined;
						const disabled =
							isBefore(start, now) ||
							(ownBooking
								// In a booking's column, every cell outside that
								// booking's slot is disabled.
								? !isTouchingRange([start, end], [ownBooking.start, ownBooking.end])
								// In the select column, cells conflicting with any
								// booking are disabled.
								: bookings?.some((b) => isTouchingRange([start, end], [b.start, b.end])));

						return (
							<DaySlot
								key={col}
								start={start}
								end={end}
								range={range}
								state={disabled ? 'disabled' : 'available'}
								index={col}
								offset={0}
							/>
						);
					}),
				)}
				<div className={s.bookings}>
					{bookings?.map(({ start, end, member, equipment, note }, idx) => {
						const state = getBookingState(bookings[idx], userId);
						return (
							<DaySlot
								key={idx}
								state={state}
								start={start}
								end={end}
								range={range}
								index={idx}
								offset={columnOffset}
							>
								<>
									<h5>
										{member?.firstName} {member?.lastName}
									</h5>
									<p>
										<span>{formatSlotDateRange(start, end)}</span>
										<br />
										{equipment?.map(({ title }, idx) => (
											<React.Fragment key={idx}>
												{title}
												<br />
											</React.Fragment>
										))}
										{note && <>"{note}"</>}
									</p>
								</>
							</DaySlot>
						);
					})}
				</div>
				<div className={s.selection}>
					{selection && (
						<DaySlot
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
