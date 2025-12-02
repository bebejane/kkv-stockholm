import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { useShallow } from 'zustand/react/shallow';
import { CalendarView } from '../Calendar';
import { addHours, differenceInHours, isAfter, isBefore, isSameDay, isSameHour } from 'date-fns';
import { isAfterOrSame, isBeforeOrSame } from '@/lib/dates';

export interface UseCalendarSelectionState {
	view: CalendarView['id'];
	range: [Date, Date] | null;
	selection: [Date, Date] | null;
	setView: (view: CalendarView['id'], start?: Date) => void;
	setSelection: (start: Date, end: Date) => void;
	addSelection: (start: Date, end: Date) => void;
	clerSelection: () => void;
	setRange: (range: [Date, Date]) => void;
}

const useCalendarSelection = create<UseCalendarSelectionState>((set) => ({
	view: 'week',
	selection: null,
	range: null,
	setView: (view: CalendarView['id'], start?: Date) => {
		set({ view });
	},
	addSelection: (start, end) => {
		set(({ selection }) => {
			if (!selection) return { selection: [start, end] };
			if (selection[0] === start && selection[1] === end) return { selection: null };

			const sDiff = differenceInHours(start, selection[0]);
			const eDiff = differenceInHours(end, selection[1]);

			if (sDiff === -1) return { selection: [start, selection[1]] };
			if (eDiff === 1) return { selection: [selection[0], end] };
			if (sDiff === 0) return { selection: null };
			return { selection: [start, end] };
		});
	},
	setSelection: (start, end) => {
		set({ selection: [start, end] });
	},
	clerSelection: () => {
		set({ selection: null });
	},
	setRange: (range: [Date, Date]) => {
		set({ range });
	},
}));

export { useCalendarSelection, shallow, useShallow };
