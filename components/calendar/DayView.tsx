import s from './DayView.module.scss';
import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { HOURS, START_HOUR, END_HOUR } from '@/lib/constants';
import { addHours } from 'date-fns';
import { isToday } from 'date-fns';
import { Slot } from './Slot';
import { formatTimeRange, tzDate, tzFormat } from '@/lib/dates';
import { useSlotSelection } from './hooks/useSlotSelection';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';

export type DayViewProps = {
	userId?: string;
	visible: boolean;
	disabled: boolean;
};

export function DayView({ userId, visible, disabled }: DayViewProps) {
	const [range, data, selection, setSelection, view] = useBookingCalendarStore(
		useShallow((state) => [
			state.range,
			state.data,
			state.selection,
			state.setSelection,
			state.view,
		]),
	);
	const gridRef = useRef<HTMLDivElement | null>(null);
	const { selection: _selection } = useSlotSelection({
		ref: gridRef,
		disable: disabled,
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
					<Slot
						key={h}
						start={addHours(range[0], parseInt(hour))}
						end={addHours(range[0], parseInt(hour) + 1)}
						range={range}
						view='day'
					/>
				))}
			</div>
			<div className={cn(s.sub, s.bookings)}>
				{data?.map(({ id, start, end, member, equipment, note }) => (
					<Slot
						key={id}
						state={member.user === userId ? 'you' : 'unavailable'}
						start={start}
						end={end}
						range={range}
						view='day'
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
										<br />
										{note}
									</>
								)}
							</p>
						</>
					</Slot>
				))}
			</div>
			<div className={cn(s.sub, s.selection)}>
				{selection && (
					<Slot state={'you'} start={selection[0]} end={selection[1]} range={range} view='day' />
				)}
			</div>
		</div>
	);
}
