import s from './LongTermSelection.module.scss';
import cn from 'classnames';
import { useBookingCalendarStore } from '@/components/calendar/hooks/useBookingCalendarStore';
import { START_HOUR, END_HOUR } from '@/lib/constants';
import { tzDate } from '@/lib/dates';
import { DatePickerInput } from '@mantine/dates';
import { addDays, isAfter, isSameDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { Loader } from '@mantine/core';

export type LongTermSelectionProps = {
	show: boolean;
	workshopId: string;
	equipmentIds: string[];
	onUnavailable: (available: boolean) => void;
};

export function LongTermSelection({ show }: LongTermSelectionProps) {
	const minDate = addDays(tzDate(new Date()), 1);
	const [longTermDate, setLongTermDate] = useState<{ start?: Date; end?: Date } | null>(null);
	const [checking, setChecking] = useState<boolean>(false);
	const [selection, setSelection, error, loading, _checking] = useBookingCalendarStore(
		useShallow((state) => [
			state.selection,
			state.setSelection,
			state.error,
			state.loading,
			state.checking,
		]),
	);

	function handleLongTermDateChange(value: string | null, type: 'from' | 'to') {
		if (!value) setLongTermDate({ start: undefined, end: undefined });
		const { start, end } = longTermDate ?? {};
		const date = tzDate(value, type === 'from' ? START_HOUR : END_HOUR);

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

	useEffect(() => {
		const isCheckingLongTerm =
			longTermDate?.start === selection?.[0] && longTermDate?.end === selection?.[1] && _checking;
		setChecking(isCheckingLongTerm);
	}, [_checking, selection]);

	return (
		<div className={cn(s.longterm, show && s.show, checking && s.disabled)}>
			<div className={s.range}>
				{checking && (
					<div className={s.loading}>
						<Loader key={checking ? 'loading' : 'silent'} color='primaryLight' size={'xs'} />
					</div>
				)}
				<span>Från:</span>
				<DatePickerInput
					key={`${longTermDate?.start?.toISOString()}-start`}
					name='from'
					valueFormat='DD MMM YYYY'
					placeholder={'Välj datum'}
					value={longTermDate?.start ?? undefined}
					minDate={minDate}
					onChange={(value) => handleLongTermDateChange(value, 'from')}
				/>
				<span>Till:</span>
				<DatePickerInput
					key={`${longTermDate?.end?.toISOString()}-end`}
					name='to'
					valueFormat='DD MMM YYYY'
					placeholder={'Välj datum'}
					value={longTermDate?.end ?? undefined}
					minDate={longTermDate?.start ?? undefined}
					onChange={(value) => handleLongTermDateChange(value, 'to')}
				/>
			</div>
		</div>
	);
}
