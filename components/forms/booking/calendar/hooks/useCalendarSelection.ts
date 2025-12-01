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
			return { selection: [start, end] };
			// if (!selection) return { selection: [start, end] };
			// if (selection[0] === start && selection[1] === end) return { selection: null };
			// const [s, e] = selection;

			// if (differenceInHours(start, s) <= 1) return { selection: [start, e] };
			// if (differenceInHours(end, e) <= 1) return { selection: [s, end] };

			// return { selection: [start, end] };
		});
	},
	setSelection: (start, end) => {
		set({ selection: [start, end] });
	},
	setRange: (range: [Date, Date]) => {
		set({ range });
	},
}));

export { useCalendarSelection, shallow, useShallow };
