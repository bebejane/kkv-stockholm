import { useCalendarSelection, useShallow } from './hooks/useCalendarSelection';
import s from './Slot.module.scss';
import cn from 'classnames';
import { addDays, formatDate, getDay, isAfter, isBefore, isSameDay } from 'date-fns';
import { CSSProperties } from 'react';
import { CalendarView } from '@/components/forms/booking/calendar/Calendar';
import { isAfterOrSame, isBeforeOrSame } from '@/lib/dates';

export type SlotProps = {
	start: Date;
	end: Date;
	disabled?: boolean;
	label?: string;
	className?: string;
	state?: 'available' | 'unavailable' | 'shared' | 'you' | 'inactive';
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export function Slot({ start, end, state, disabled, label, className, onClick }: SlotProps) {
	const [selection, setSelection, view, range] = useCalendarSelection(
		useShallow((s) => [s.selection, s.setSelection, s.view, s.range])
	);

	const outsideRange = !range || isBefore(start, range[0]) || isAfter(end, range[1]);
	const isYou = isAfterOrSame(start, selection?.[0]) && isBeforeOrSame(end, selection?.[1]);
	const now = new Date();
	const _disabled = isBefore(start, now);
	console.log(selection);
	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		console.log('set selection', start, end);
		setSelection(start, end);
	}

	return (
		<div
			className={cn(s.slot, className)}
			data-start={start}
			data-end={end}
			data-state={state}
			aria-disabled={disabled || _disabled}
			style={isYou ? slotStyle(start, end, view) : undefined}
			onClick={handleClick}
		>
			{label}
		</div>
	);
}

function slotStyle(s: Date, e: Date, view: CalendarView['id']): CSSProperties {
	const colOffset = 1;
	const rowOffset = 2;
	const wd = getDay(s) === 0 ? 7 : getDay(s);

	return {
		gridColumn: wd + colOffset,
		gridRow: e.getHours() + rowOffset,
	};
}
