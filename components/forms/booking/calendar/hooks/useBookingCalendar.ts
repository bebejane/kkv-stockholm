import { bookingSearchSchema } from '@/lib/schemas/booking';
import { useEffect, useRef, useState } from 'react';
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

export type UseBookingCalendarProps = {
	workshopId?: string;
	equipmentIds?: string[];
};

const defaultView = 'week';

export const useBookingCalendar = ({ workshopId, equipmentIds }: UseBookingCalendarProps) => {
	const now = new Date();
	const [view, setView] = useState<CalendarView['id']>(defaultView);
	const [date, setDate] = useState<Date>(startOfDay(now));
	const [range, setRange] = useState<[Date, Date]>([
		startOfWeek(startOfDay(now), { locale: sv }),
		endOfWeek(endOfDay(now), { locale: sv }),
	]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<AllBookingsSearchQuery['allBookings'] | null>(null);
	const aborter = useRef<AbortController | null>(null);
	const key = `${view}-${workshopId}-${equipmentIds?.join('-')}-${range.join('-')}`;

	function _setView(v: CalendarView['id'], _start?: Date) {
		const s = startOfDay(_start ?? range[0]);
		const start = v === 'day' ? s : v === 'week' ? startOfWeek(s, { locale: sv }) : startOfMonth(s);
		const end = v === 'day' ? s : v === 'week' ? endOfWeek(s, { locale: sv }) : endOfMonth(s);
		_setRange([start, end]);
	}

	function _setRange(r: [Date, Date]) {
		setRange([startOfDay(r[0]), endOfDay(r[1])]);
	}

	function prev() {
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
	}

	function next() {
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
	}

	useEffect(() => {
		const diff = differenceInDays(range[1], range[0]);
		if (diff === 0) setView('day');
		else if (diff > 0 && diff <= 7) setView('week');
		else setView('month');
	}, [range]);

	useEffect(() => {
		async function fetchData() {
			if (!workshopId || !equipmentIds) return;

			try {
				setData(null);

				const { data: session } = await authClient.getSession();
				if (!session) throw new Error('Unauthorized');

				console.log({ range, workshopId, equipmentIds });

				const data = bookingSearchSchema.parse({
					start: startOfDay(range[0]).toISOString(),
					end: endOfDay(range[1]).toISOString(),
					workshopId,
					equipmentIds,
				});

				aborter.current?.abort('AbortError');
				aborter.current = new AbortController();

				setError(null);
				setLoading(true);

				const res = await fetch(`/api/member/booking/search`, {
					method: 'POST',
					body: JSON.stringify(data),
					signal: aborter.current?.signal,
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (res.status === 200) {
					const data = await res.json();
					console.log('useBookingCalendar', 'data', data);
					setData(data);
				} else throw `${res.status}: ${res.statusText}`;
			} catch (e) {
				if (e === 'AbortError') return;
				if (e instanceof ZodError) setError(e.cause as string);
				else if (e instanceof Error) setError(e.message);
				else setError(e as string);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [key]);

	return {
		prev,
		next,
		start: range[0],
		end: range[1],
		view,
		setRange: _setRange,
		setView: _setView,
		data,
		error,
		loading,
	};
};
