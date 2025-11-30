import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { useShallow } from 'zustand/react/shallow';
import { CalendarView } from '../Calendar';

export interface UseCalendarSelectionState {
	view: CalendarView['id'];
	range: [Date, Date] | null;
	selection: [Date, Date] | null;
	setView: (view: CalendarView['id'], start?: Date) => void;
	setSelection: (start: Date, end: Date) => void;
	setRange: (range: [Date, Date]) => void;
}

const useCalendarSelection = create<UseCalendarSelectionState>((set) => ({
	view: 'week',
	selection: null,
	range: null,
	setView: (view: CalendarView['id'], start?: Date) => {
		set({ view });
	},
	setSelection: (start, end) => {
		set({ selection: [start, end] });
	},
	setRange: (range: [Date, Date]) => {
		set({ range });
	},
}));

export { useCalendarSelection, shallow, useShallow };
