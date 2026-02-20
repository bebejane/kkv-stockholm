import s from './DayView.module.scss';
import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { HOURS, START_HOUR, END_HOUR } from '@/lib/constants';
import { addHours } from 'date-fns';
import { isToday } from 'date-fns';
import { Slot } from './Slot';
import { formatTimeRange, isInsideRange, tzDate, tzFormat } from '@/lib/dates';
import { useSlotSelection } from './hooks/useSlotSelection';
import { useBookingCalendarStore } from './hooks/useBookingCalendarStore';
import { useShallow } from 'zustand/shallow';

export type DayViewProps = {
	userId?: string;
	visible: boolean;
	disabled: boolean;
};

export function DayView({ userId, visible, disabled }: DayViewProps) {
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
	const { selection: _selection } = useSlotSelection({
		ref: gridRef,
		disable: disabled,
	});
	const title = tzFormat(start, 'EEEE dd');
	const today = isToday(tzDate(start));
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
						start={addHours(start, parseInt(hour))}
						end={addHours(start, parseInt(hour) + 1)}
						range={[start, end]}
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
						range={[start, end]}
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
					<Slot
						state={'you'}
						start={selection[0]}
						end={selection[1]}
						range={[start, end]}
						view='day'
					/>
				)}
			</div>
		</div>
	);
}
