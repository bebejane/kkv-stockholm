import s from './LongTermSelection.module.scss';
import cn from 'classnames';
import { useBookingCalendarStore } from '@/components/calendar/hooks/useBookingCalendarStore';
import { START_HOUR, END_HOUR } from '@/lib/constants';
import { tzDate } from '@/lib/dates';
import { DatePickerInput } from '@mantine/dates';
import { addDays, addHours, isAfter, isSameDay, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

export type LongTermSelectionProps = {
	show: boolean;
};

export function LongTermSelection({ show }: LongTermSelectionProps) {
	const [selection, setSelection, error, loading] = useBookingCalendarStore(
		useShallow((state) => [state.selection, state.setSelection, state.error, state.loading]),
	);

	const minDate = addDays(tzDate(new Date()), 1);
	const [longTermDate, setLongTermDate] = useState<{ start?: Date; end?: Date } | null>(null);

	function handleLongTermDateChange(value: string | null, type: 'from' | 'to') {
		if (!value) setLongTermDate({ start: undefined, end: undefined });
		const { start, end } = longTermDate ?? {};
		const date = addHours(startOfDay(tzDate(value)), type === 'from' ? START_HOUR : END_HOUR);

		if (type === 'from')
			setLongTermDate({
				start: date,
				end: end ? (isAfter(date, end) ? undefined : end) : undefined,
			});
		else if (type === 'to')
			setLongTermDate({
				start,
				end: date,
			});
	}

	useEffect(() => {
		if (!longTermDate) return;
		const { start, end } = longTermDate;
		if (!start || !end) return;
		setSelection([start, end]);
	}, [longTermDate]);

	useEffect(() => {
		const { start, end } = longTermDate ?? {};
		if (!start || !end || !selection) return;

		if (!isSameDay(start, selection[0]) || !isSameDay(end, selection[1]))
			setLongTermDate({ start: undefined, end: undefined });
	}, [selection]);

	return (
		<div className={cn(s.longterm, show && s.show)}>
			<div className={s.range}>
				<span>Från:</span>
				<DatePickerInput
					key={`${longTermDate?.start?.toISOString()}-start`}
					name='from'
					valueFormat='D MMM'
					placeholder={'Välj datum'}
					value={longTermDate?.start ?? undefined}
					minDate={minDate}
					onChange={(value) => handleLongTermDateChange(value, 'from')}
				/>
				<span>Till:</span>
				<DatePickerInput
					key={`${longTermDate?.end?.toISOString()}-end`}
					name='to'
					valueFormat='D MMM'
					placeholder={'Välj datum'}
					value={longTermDate?.end ?? undefined}
					minDate={longTermDate?.start ?? undefined}
					onChange={(value) => handleLongTermDateChange(value, 'to')}
				/>
			</div>
		</div>
	);
}
