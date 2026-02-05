import s from './WeekView.module.scss';
import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { Checkbox } from '@mantine/core';
import { HOURS, DAYS } from '@/lib/constants';
import { addDays, addHours, getDay, getWeek, isAfter, isBefore } from 'date-fns';
import { capitalize } from 'next-dato-utils/utils';
import { isToday } from 'date-fns';
import { formatDate, formatDateTimeRange, formatTimeRange, tzDate, tzFormat } from '@/lib/dates';
import { Slot } from './Slot';
import { useSlotSelection } from './hooks/useSlotSelection';

export type WeekViewProps = {
	data?: AllBookingsSearchQuery['allBookings'] | null;
	start: Date;
	end: Date;
	userId?: string;
	onSelection: (start: Date | null, end?: Date) => void;
};

export function WeekView({ data, start, end, userId, onSelection }: WeekViewProps) {
	const gridRef = useRef<HTMLDivElement | null>(null);
	const { selection, reset } = useSlotSelection({ ref: gridRef });

	function columnDate(wd: number, hour: number) {
		return addDays(addHours(start, hour), wd);
	}

	useEffect(() => {
		selection ? onSelection(selection[0], selection[1]) : onSelection(null);
	}, [selection]);

	return (
		<div className={s.container}>
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
				<div className={cn(s.header, 'small')}>Heldag</div>
				{DAYS.map((day) => (
					<div className={cn(s.header, 'small')} key={day}>
						<Checkbox label={'Boka heldag'} size={'xs'} onClick={reset} />
					</div>
				))}
				<div className={cn(s.hours, 'very-small')}>
					{HOURS.map((hour, h) => (
						<div key={h} className='very-small'>
							{hour}
						</div>
					))}
				</div>
				<div className={s.sub} ref={gridRef}>
					{HOURS.map((hour, h) =>
						new Array(DAYS.length)
							.fill(null)
							.map((_, wd: number) => (
								<Slot key={wd} start={columnDate(wd, h)} end={columnDate(wd, h + 1)} view='week' />
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
					{selection && <Slot state={'you'} start={selection[0]} end={selection[1]} view='week' />}
				</div>
			</div>
		</div>
	);
}
