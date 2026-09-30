import s from './LongTermSelection.module.scss';
import cn from 'classnames';
import { useBookingCalendarStore } from '@/components/calendar/hooks/useBookingCalendarStore';
import { START_HOUR, END_HOUR } from '@/lib/constants';
import { formatDateTimeRange, tzDate } from '@/lib/dates';
import { DatePickerInput } from '@mantine/dates';
import { addDays, isAfter, isSameDay } from 'date-fns';
import { useCallback, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { Loader } from '@mantine/core';
import { parseErrorMessage } from '@/lib/utils';

export type LongTermSelectionProps = {
	show: boolean;
	workshopId?: string;
	equipmentIds: string[];
	onUnavailable: (available: boolean) => void;
};

export function LongTermSelection({ show }: LongTermSelectionProps) {
	const minDate = addDays(tzDate(new Date()), 1);
	const [start, setStart] = useState<Date | null>(null);
	const [end, setEnd] = useState<Date | null>(null);
	const [checking, setChecking] = useState<boolean>(false);
	const [selection, setSelection, check, setError] = useBookingCalendarStore(
		useShallow((state) => [state.selection, state.setSelection, state.check, state.setError]),
	);

	const reset = useCallback(() => {
		setStart(null);
		setEnd(null);
		setSelection(null);
	}, [setSelection]);

	// The availability check is started from the date-change handler (not an
	// effect), and reports back through callbacks.
	const runCheck = useCallback(
		(from: Date, to: Date) => {
			setChecking(true);
			check([from, to], true)
				.then((available) => {
					if (available === true) setSelection([from, to]);
					else if (available === false) {
						reset();
						setError(
							`Vald tid är ej tillgänglig: ${formatDateTimeRange(from, to, { short: true })}`,
						);
					}
					// `null` means the check was superseded/aborted — leave the dates alone.
				})
				.catch((e) => {
					setError(parseErrorMessage(e));
					reset();
				})
				.finally(() => {
					setChecking(false);
				});
		},
		[check, reset, setError, setSelection],
	);

	function handleLongTermDateChange(value: string | null, type: 'from' | 'to') {
		if (!value) {
			reset();
			return;
		}
		const date = tzDate(value, type === 'from' ? START_HOUR : END_HOUR);
		if (type === 'from') {
			setStart(date);
			setEnd(null);
			setSelection(null);
			return;
		}
		setEnd(date);
		if (start) runCheck(start, date);
	}

	// Clear the pickers when the selection drifts from them (e.g. a selection
	// made in the calendar), adjusting during render instead of in an effect.
	const [lastSelection, setLastSelection] = useState(selection);
	if (selection !== lastSelection) {
		setLastSelection(selection);
		if (selection && (start !== selection[0] || end !== selection[1])) {
			setStart(null);
			setEnd(null);
		}
	}

	return (
		<div className={cn(s.longterm, show && s.show, checking && s.disabled)}>
			<div className={s.title}>Långtidsbokning</div>
			<div className={s.range}>
				{checking && (
					<div className={s.loading}>
						<Loader key={checking ? 'loading' : 'silent'} color='primaryLight' size={'xs'} />
					</div>
				)}
				<span className='small'>Från:</span>
				<DatePickerInput
					name='from'
					valueFormat='DD MMM YYYY'
					placeholder={'Välj datum'}
					value={start}
					minDate={minDate}
					data-date={Boolean(start)}
					onChange={(value) => handleLongTermDateChange(value, 'from')}
				/>
				<span className='small'>Till:</span>
				<DatePickerInput
					name='to'
					valueFormat='DD MMM YYYY'
					placeholder={'Välj datum'}
					value={end}
					data-date={Boolean(end)}
					minDate={start ?? minDate}
					onChange={(value) => handleLongTermDateChange(value, 'to')}
				/>
			</div>
		</div>
	);
}
