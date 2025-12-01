import { useCalendarSelection, useShallow } from './hooks/useCalendarSelection';
import s from './Slot.module.scss';
import cn from 'classnames';
import { addDays, formatDate, getDay, isAfter, isBefore, isSameDay } from 'date-fns';
import { CSSProperties } from 'react';
import { CalendarView } from '@/components/forms/booking/calendar/Calendar';

export type SlotProps = {
	start: Date;
	end: Date;
	disabled?: boolean;
	label?: string;
	className?: string;
	state?: 'available' | 'unavailable' | 'shared' | 'you' | 'inactive';
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

function isAfterOrSame(d1?: Date, d2?: Date) {
	if (!d1 || !d2) return false;
	return isAfter(d1, d2) || isSameDay(d1, d2);
}

function isBeforeOrSame(d1?: Date, d2?: Date) {
	if (!d1 || !d2) return false;
	return isBefore(d1, d2) || isSameDay(d1, d2);
}

export function Slot({ start, end, state, disabled, label, className, onClick }: SlotProps) {
	const [selection, setSelection, view, range] = useCalendarSelection(
		useShallow((s) => [s.selection, s.setSelection, s.view, s.range])
	);

	const outsideRange = !range || isBefore(start, range[0]) || isAfter(end, range[1]);
	const isYou = isAfterOrSame(start, selection?.[0]) && isBeforeOrSame(end, selection?.[1]);
	const now = new Date();
	const _disabled = isBefore(start, now);

	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		console.log('set selection', start, end);
		setSelection(start, end);
	}

	//isYou && console.log('isYou', start, end);
	//console.log(start, end);

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

	return {
		gridColumn: 7 - getDay(s) + colOffset,
		gridRow: e.getHours() + rowOffset,
	};
}
