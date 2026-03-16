import s from './DayView.module.scss';
import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { HOURS, START_HOUR, END_HOUR } from '@/lib/constants';
import { isToday } from 'date-fns';
import { DaySlot } from './DaySlot';
import { formatSlotDateRange, tzDate, tzFormat } from '@/lib/dates';
import { useSlotSelection } from './hooks/useSlotSelection';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';
import React from 'react';

export type DayViewProps = {
	userId?: string;
	visible: boolean;
	disabled: boolean;
};

export function DayView({ userId, visible, disabled }: DayViewProps) {
	const [range, bookings, selection, setSelection, view] = useBookingCalendarStore(
		useShallow((state) => [
			state.range,
			state.bookings,
			state.selection,
			state.setSelection,
			state.view,
		]),
	);
	const gridRef = useRef<HTMLDivElement | null>(null);
	const { selection: _selection } = useSlotSelection({
		ref: gridRef,
		disable: disabled,
		range,
		bookings,
		key: process.env.NODE_ENV === 'development' ? Math.random().toString() : undefined,
	});
	const title = tzFormat(range[0], 'EEEE dd');
	const today = isToday(tzDate(range[0]));
	const hours = HOURS.filter((_, h) => h >= START_HOUR && h < END_HOUR);

	useEffect(() => {
		_selection && setSelection(_selection);
	}, [_selection]);

	return (
		<div className={cn(s.day, !visible && s.hidden)}>
			<div className={s.header} />
			<div className={cn(s.header, today && s.today)}>{title}</div>
			<div className={s.hours}>
				{hours.map((hour, h) => (
					<div className='very-small' key={hour}>
						{hour}
					</div>
				))}
			</div>
			<div className={s.sub} ref={gridRef}>
				{hours.map((hour, h) => (
					<DaySlot
						key={h}
						start={tzDate(range[0], parseInt(hour))}
						end={tzDate(range[0], parseInt(hour) + 1)}
						range={range}
						view='day'
						index={0}
					/>
				))}
			</div>
			<div className={cn(s.sub, s.bookings)}>
				{bookings?.map(({ id, start, end, member, equipment, note }, idx) => {
					const state =
						member.user === userId
							? 'you'
							: equipment.some((e) => e.exclusive)
								? 'unavailable'
								: 'shared';
					return (
						<DaySlot
							key={id}
							state={state}
							start={start}
							end={end}
							index={idx}
							range={range}
							view='day'
						>
							<>
								<h5>
									{member?.firstName} {member?.lastName}
								</h5>
								<p>
									{formatSlotDateRange(start, end)}
									<br />
									{equipment?.map(({ id, title }) => (
										<React.Fragment key={id}>
											{title}
											<br />
										</React.Fragment>
									))}
									{note && (
										<>
											<br />
											{note}
										</>
									)}
								</p>
							</>
						</DaySlot>
					);
				})}
			</div>
			<div className={cn(s.sub, s.selection)}>
				{selection && (
					<DaySlot
						state={'selection'}
						start={selection[0]}
						end={selection[1]}
						range={range}
						view='day'
						index={0}
					/>
				)}
			</div>
		</div>
	);
}
