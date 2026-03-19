import { bookingAvilabilitySchema, bookingSearchSchema } from '@/lib/schemas/booking';
import { ZodError } from 'zod';
import { authClient } from '@/auth/auth-client';
import { CalendarView } from '../Calendar';
import { sv } from 'date-fns/locale';
import {
	startOfDay,
	endOfDay,
	addDays,
	addMonths,
	addWeeks,
	startOfWeek,
	startOfMonth,
	endOfWeek,
	endOfMonth,
	isEqual,
} from 'date-fns';
import { create } from 'zustand';
import { formatDateTimeRange, tzDate } from '@/lib/dates';
import { parseErrorMessage } from '@/lib/utils';

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
	params?: { workshopId?: string; equipmentIds?: string[] };
	mode: 'view' | 'edit';
	bookings: AllBookingsSearchQuery['allBookings'] | null;
	loading: boolean;
	checking: boolean;
	error: string | null;
	setError: (error: string | null) => void;
	prev: () => void;
	next: () => void;
	setSelection: (selection: [Date, Date] | null) => void;
	setRange: (range: [Date, Date]) => void;
	setView: (view: CalendarView['id'], start?: Date) => void;
	setParams: (params: { workshopId?: string; equipmentIds?: string[] }) => void;
	setMode: (mode: 'view' | 'edit') => void;
	fetchData: (workshopId?: string, equipmentIds?: string[]) => Promise<void>;
	check: (range: [Date, Date] | null, silent?: boolean) => Promise<boolean | null>;
};

const defaultView = 'week';

export const useBookingCalendarStore = create<BookingCalendarState>((set, get) => {
	const now = tzDate(new Date());
	let checkTimeout: NodeJS.Timeout | null = null;
	let fetchTimeout: NodeJS.Timeout | null = null;
	let aborter = new AbortController();
	let checkAborter = new AbortController();

	function _setRange(range: [Date, Date]) {
		const start = startOfDay(range[0]);
		const end = endOfDay(range[1]);
		set({
			range: [start, end],
			start,
			end,
		});

		get().fetchData();
	}

	function _setView(view: CalendarView['id'], start?: Date) {
		const s = startOfDay(tzDate(start ?? new Date()));
		const rangeStart =
			view === 'day' ? s : view === 'week' ? startOfWeek(s, { locale: sv }) : startOfMonth(s);
		const rangeEnd =
			view === 'day' ? s : view === 'week' ? endOfWeek(s, { locale: sv }) : endOfMonth(s);
		_setRange([rangeStart, rangeEnd]);
		set({ view });
		get().fetchData();
	}

	function _setSelection(selection: null | [Date, Date]) {
		const current = get().selection;
		const changed =
			selection &&
			current &&
			!(isEqual(selection[0], current[0]) && isEqual(selection[1], current[1]));

		if (selection === null || current === null) return set({ selection });

		if (!changed) return;

		set({ selection });

		checkTimeout && clearTimeout(checkTimeout);
		checkTimeout = setTimeout(() => {
			get()
				.check(selection)
				.then((available) => {
					if (available === false) {
						set({
							error: `Vald tid är ej tillgänglig: ${formatDateTimeRange(selection[0], selection[1], { short: true })}`,
							selection: null,
						});
					}
				})
				.catch((e) => get().setError(e));
		}, 300);
	}

	function filterAvailableBookings(
		bookings: BookingRecord[] | undefined,
		equipmentIds: string[] | undefined,
		userId: string | undefined | null,
		mode: 'view' | 'edit',
	): BookingRecord[] {
		return (
			bookings?.filter((b) => {
				if (b.member.user === userId || !equipmentIds?.length || mode === 'view') return true;
				if (
					b.equipment
						.filter(({ id, exclusive }) => equipmentIds?.includes(id) && exclusive)
						.some((e) => e.exclusive)
				)
					return true;

				return false;
			}) ?? []
		);
	}

	return {
		view: defaultView,
		date: startOfDay(now),
		start: startOfWeek(startOfDay(now), { locale: sv }),
		end: endOfWeek(endOfDay(now), { locale: sv }),
		range: [startOfWeek(startOfDay(now), { locale: sv }), endOfWeek(endOfDay(now), { locale: sv })],
		params: undefined,
		mode: 'view',
		selection: null,
		loading: false,
		error: null,
		bookings: null,
		checking: false,
		setParams: (params: { workshopId?: string; equipmentIds?: string[] }) => {
			set({ params });
			get().fetchData();
		},
		setMode: (mode: 'view' | 'edit') => {
			set({ mode });
			get().fetchData();
		},
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
		setSelection: _setSelection,
		setRange: _setRange,
		setView: _setView,
		setError: (error: string | null) => set({ error }),
		fetchData: async () => {
			fetchTimeout && clearTimeout(fetchTimeout);
			set({ bookings: null, error: null, loading: true });

			fetchTimeout = setTimeout(async () => {
				try {
					const { data: session, error } = await authClient.getSession();
					if (!session) throw new Error('Unauthorized');
					if (error) throw parseErrorMessage(error);
					const { params, range, mode } = get();

					const data = bookingSearchSchema.parse({
						mode,
						start: startOfDay(range[0]).toISOString(),
						end: endOfDay(range[1]).toISOString(),
						...params,
					});

					//console.log('useBookingCalendarStore', 'fetchData', data);
					aborter.abort('AbortError');
					aborter = new AbortController();

					const res = await fetch(`/api/member/booking/search`, {
						method: 'POST',
						body: JSON.stringify(data),
						signal: aborter.signal,
						headers: { 'Content-Type': 'application/json' },
					});

					if (res.status === 200) {
						const bookings = await res.json();
						set({ bookings });
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
			}, 200);
		},
		check: async (range, silent = false) => {
			if (!range) return true;

			let available: boolean | null = null;

			try {
				if (!silent) set({ checking: true });

				const { data: session } = await authClient.getSession();
				if (!session) throw new Error('Unauthorized');

				const { params, range, mode } = get();
				const data = bookingAvilabilitySchema.parse({
					start: range[0].toISOString(),
					end: range[1].toISOString(),
					...params,
					mode,
				});

				checkAborter.abort('AbortError');
				checkAborter = new AbortController();

				const res = await fetch(`/api/member/booking/availability`, {
					method: 'POST',
					body: JSON.stringify(data),
					signal: checkAborter.signal,
					headers: { 'Content-Type': 'application/json' },
				});

				if (res.ok) {
					const data = await res.json();
					available = data.available;
				} else throw `${res.status}: ${res.statusText}`;
			} catch (e) {
				if (typeof e === 'string' && !e.includes('AbortError')) {
					set({ error: parseErrorMessage(e) });
					available = false;
					console.log(e);
				} else {
					available = null;
				}
			} finally {
				set({ checking: false });
			}
			return available;
		},
	};
});
