import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { useShallow } from 'zustand/react/shallow';
import { CalendarView } from '../Calendar';
import {
	addHours,
	differenceInHours,
	getHours,
	isAfter,
	isBefore,
	isSameDay,
	isSameHour,
} from 'date-fns';
import { isAfterOrSame, isBeforeOrSame } from '@/lib/dates';
import { createRef, MutableRefObject, RefObject } from 'react';

export interface UseCalendarSelectionState {
	view: CalendarView['id'];
	range: [Date, Date] | null;
	selection: [Date, Date] | null;
	_selection: RefObject<[Date, Date] | null>;
	mouseDown: RefObject<boolean | null>;
	setView: (view: CalendarView['id'], start?: Date) => void;
	setSelection: (start: Date, end: Date) => void;
	addSelection: (start: Date, end: Date) => void;
	clerSelection: () => void;
	setRange: (range: [Date, Date]) => void;
}

const useCalendarSelection = create<UseCalendarSelectionState>((set, get) => ({
	view: 'week',
	selection: null,
	_selection: createRef(),
	range: null,
	mouseDown: createRef(),
	setView: (view: CalendarView['id'], start?: Date) => {
		set({ view });
	},
	addSelection: (start, end) => {
		set(() => {
			const selection = get()._selection;
			const current = selection.current;
			let next: [Date, Date] | null = null;

			//console.log(start, end, current);
			//console.log(getHours(start));

			if (!current) next = [start, end];
			//else if (current[0] === start && current[1] === end) next = null;
			else {
				const sDiff = differenceInHours(start, current[0]);
				const eDiff = differenceInHours(end, current[1]);

				if (sDiff === -1) next = [start, current[1]];
				else if (eDiff === 1) next = [current[0], end];
				else {
					next = [start, end];
				}
			}
			selection.current = next;
			return { selection: next };
		});
	},
	setSelection: (start, end) => {
		get()._selection.current = [start, end];
		set({ selection: [start, end] });
	},
	clerSelection: () => {
		get()._selection.current = null;
		set({ selection: null });
	},
	setRange: (range: [Date, Date]) => {
		set({ range });
	},
}));

export { useCalendarSelection, shallow, useShallow };
