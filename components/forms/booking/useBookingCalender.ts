import { bookingSearchSchema } from '@/lib/schemas/booking';
import { useEffect, useRef, useState } from 'react';
import { ZodError } from 'zod';
import { authClient } from '@/auth/auth-client';
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
import { sv } from 'date-fns/locale';
import { TZ } from '@/lib/constants';

import { CalendarView } from './types';

export type UseBookingCalenderProps = {
	workshopId?: string;
	equipmentIds?: string[];
};

const defaultView = 'week';

export const useBookingCalender = ({ workshopId, equipmentIds }: UseBookingCalenderProps) => {
	const now = new Date();
	const [view, setView] = useState<CalendarView['id']>(defaultView);
	const [range, setRange] = useState<[Date, Date]>([
		startOfWeek(now, { locale: sv }),
		addDays(startOfWeek(now, { locale: sv }), 7),
	]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<AllBookingsSearchQuery['allBookings'] | null>(null);
	const aborter = useRef<AbortController | null>(null);
	const key = `${view}-${workshopId}-${equipmentIds?.join('-')}-${range.join('-')}`;

	function prev() {
		const start =
			view === 'day' ? addDays(range[0], -1) : view === 'week' ? addWeeks(range[0], -1) : addMonths(range[0], -1);
		const end = view === 'day' ? start : view === 'week' ? endOfWeek(start) : endOfMonth(start);
		setRange((r) => [start, end]);
	}
	function next() {
		const start =
			view === 'day' ? addDays(range[0], 1) : view === 'week' ? addWeeks(range[0], 1) : addMonths(range[0], 1);
		const end = view === 'day' ? start : view === 'week' ? endOfWeek(start) : endOfMonth(start);
		setRange((r) => [start, end]);
	}

	function _setView(v: CalendarView['id']) {
		const start = v === 'day' ? range[0] : v === 'week' ? startOfWeek(range[0]) : startOfMonth(range[0]);
		const end = v === 'day' ? start : v === 'week' ? endOfWeek(start) : endOfMonth(start);
		setRange((r) => [start, end]);
	}

	useEffect(() => {
		const diff = differenceInDays(range[1], range[0]);
		if (diff === 0) setView('day');
		else if (diff > 0 && diff <= 7) setView('week');
		else setView('month');
	}, [range]);

	useEffect(() => {
		async function fetchData() {
			try {
				const { data: session } = await authClient.getSession();
				if (!session) throw new Error('Unauthorized');

				console.log('useBookingCalender', 'fetch', range[0], range[1]);

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

				const res = await fetch(`/api/booking/search`, {
					method: 'POST',
					body: JSON.stringify(data),
					signal: aborter.current?.signal,
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (res.status === 200) {
					const data = await res.json();
					console.log('useBookingCalender', 'data', data);
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
		setRange,
		prev,
		next,
		start: range[0],
		end: range[1],
		view,
		setView: _setView,
		data,
		error,
		loading,
	};
};
