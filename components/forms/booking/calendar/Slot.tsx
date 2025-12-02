import { useCalendarSelection, useShallow } from './hooks/useCalendarSelection';
import s from './Slot.module.scss';
import cn from 'classnames';
import {
	addDays,
	differenceInHours,
	formatDate,
	getDay,
	isAfter,
	isBefore,
	isSameDay,
} from 'date-fns';
import { CSSProperties } from 'react';
import { CalendarView } from '@/components/forms/booking/calendar/Calendar';
import { isAfterOrSame, isBeforeOrSame, tzDate } from '@/lib/dates';

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
	const [selection, setSelection, view, range, addSelection] = useCalendarSelection(
		useShallow((s) => [s.selection, s.setSelection, s.view, s.range, s.addSelection])
	);

	const outsideRange = false; //!range || isBefore(start, range[0]) || isAfter(end, range[1]);
	const now = tzDate(new Date());
	const isYou = isAfterOrSame(start, selection?.[0]) && isBeforeOrSame(end, selection?.[1]);
	const _disabled = isBefore(start, now);

	if (isYou && outsideRange) return null;

	function handleClick(e: React.MouseEvent<HTMLDivElement>) {
		console.log('set selection', start, end);
		addSelection(start, end);
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
	const col = getDay(s) === 0 ? 7 : getDay(s);
	const rowStart = s.getHours() + 1;
	const rowEnd = e.getHours() + 1;
	return {
		gridColumn: col,
		gridRow: `${rowStart} / ${rowEnd}`,
	};
}
