import { bookingSearchSchema } from '@/lib/schemas/booking';
import { ZodError } from 'zod';
import { authClient } from '@/auth/auth-client';
import { CalendarView } from '../Calendar';
import { sv } from 'date-fns/locale';
import {
	startOfDay,
	endOfDay,
	differenceInDays,
	addDays,
	addMonths,
	addWeeks,
	startOfWeek,
	startOfMonth,
	endOfWeek,
	endOfMonth,
} from 'date-fns';
import { create } from 'zustand';

export type UseBookingCalendarProps = {
	workshopId?: string;
	equipmentIds?: string[];
};

type BookingCalendarState = {
	view: CalendarView['id'];
	date: Date;
	range: [Date, Date];
	start: Date;
	end: Date;
	selection: [Date, Date] | null;
	loading: boolean;
	error: string | null;
	data: AllBookingsSearchQuery['allBookings'] | null;
	prev: () => void;
	next: () => void;
	setSelection: (selection: [Date, Date] | null) => void;
	setRange: (range: [Date, Date]) => void;
	setView: (view: CalendarView['id'], start?: Date) => void;
	fetchData: (workshopId?: string, equipmentIds?: string[]) => Promise<void>;
};

const defaultView = 'week';

export const useBookingCalendarStore = create<BookingCalendarState>((set, get) => {
	const now = new Date();
	const aborter = new AbortController();

	const _setRange = (range: [Date, Date]) => {
		set({
			range: [startOfDay(range[0]), endOfDay(range[1])],
			start: startOfDay(range[0]),
			end: endOfDay(range[1]),
		});
	};

	const _setView = (view: CalendarView['id'], start?: Date) => {
		const s = startOfDay(start ?? new Date());
		const rangeStart =
			view === 'day' ? s : view === 'week' ? startOfWeek(s, { locale: sv }) : startOfMonth(s);
		const rangeEnd =
			view === 'day' ? s : view === 'week' ? endOfWeek(s, { locale: sv }) : endOfMonth(s);
		_setRange([rangeStart, rangeEnd]);
		set({ view });
	};

	return {
		view: defaultView,
		date: startOfDay(now),
		start: startOfWeek(startOfDay(now), { locale: sv }),
		end: endOfWeek(endOfDay(now), { locale: sv }),
		range: [startOfWeek(startOfDay(now), { locale: sv }), endOfWeek(endOfDay(now), { locale: sv })],
		selection: null,
		loading: false,
		error: null,
		data: null,
		prev: () => {
			const { view, range } = get();
			const start =
				view === 'day'
					? addDays(range[0], -1)
					: view === 'week'
						? addWeeks(range[0], -1)
						: addMonths(range[0], -1);
			const end =
				view === 'day'
					? start
					: view === 'week'
						? endOfWeek(start, { locale: sv })
						: endOfMonth(start);
			_setRange([start, end]);
		},
		next: () => {
			const { view, range } = get();
			const start =
				view === 'day'
					? addDays(range[0], 1)
					: view === 'week'
						? addWeeks(range[0], 1)
						: addMonths(range[0], 1);
			const end =
				view === 'day'
					? start
					: view === 'week'
						? endOfWeek(start, { locale: sv })
						: endOfMonth(start);
			_setRange([start, end]);
		},
		setSelection: (selection) => set({ selection }),
		setRange: _setRange,
		setView: _setView,
		fetchData: async (workshopId, equipmentIds) => {
			if (!workshopId || !equipmentIds) return;

			try {
				set({ data: null, error: null, loading: true });

				const { data: session } = await authClient.getSession();
				if (!session) throw new Error('Unauthorized');

				const { range } = get();
				const data = bookingSearchSchema.parse({
					start: startOfDay(range[0]).toISOString(),
					end: endOfDay(range[1]).toISOString(),
					workshopId,
					equipmentIds,
				});

				aborter.abort('AbortError');
				const newAborter = new AbortController();
				set({ loading: true });

				const res = await fetch(`/api/member/booking/search`, {
					method: 'POST',
					body: JSON.stringify(data),
					signal: newAborter.signal,
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (res.status === 200) {
					const result = await res.json();
					set({ data: result });
				} else {
					throw `${res.status}: ${res.statusText}`;
				}
			} catch (e) {
				if (e === 'AbortError') return;
				if (e instanceof ZodError) set({ error: e.cause as string });
				else if (e instanceof Error) set({ error: e.message });
				else set({ error: e as string });
			} finally {
				set({ loading: false });
			}
		},
	};
});
