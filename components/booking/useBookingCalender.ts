import { MemberUserSession } from '@/auth/utils';
import { View } from '@/components/booking/BookingCalender';
import { bookingSearchSchema } from '@/lib/schemas';
import { useEffect, useRef, useState } from 'react';
import { ZodError } from 'zod';
import { authClient } from '@/auth/auth-client';
import { startOfDay, endOfDay } from 'date-fns';

export type UseBookingCalenderProps = {
	view: View['id'];
	range: [Date, Date];
	workshopId?: string;
	equipmentIds?: string[];
};

export const useBookingCalender = ({ view: _view, workshopId, equipmentIds }: UseBookingCalenderProps) => {
	const [view, setView] = useState<View['id']>(_view);
	const [range, setRange] = useState<[Date, Date]>([new Date(), new Date()]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [authorized, setAuthorized] = useState(false);
	const [data, setData] = useState<AllBookingsSearchQuery['allBookings'] | null>(null);
	const aborter = useRef<AbortController | null>(null);
	const key = `${view}-${workshopId}-${equipmentIds?.join('-')}`;

	useEffect(() => {
		async function fetchData() {
			try {
				console.log('fetch');
				const { data: session } = await authClient.getSession();
				if (!session) throw new Error('Unauthorized');
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
					console.log(data);
					setData(data);
				} else throw `${res.status}: ${res.statusText}`;
			} catch (e) {
				console.log(e);
				if (e === 'AbortError') return;
				if (e instanceof ZodError) setError(e.cause as string);
				else if (e instanceof Error) setError(e.message);
				else setError(e as string);
			} finally {
				setLoading(false);
			}
		}
		console.log('update');
		fetchData();
	}, [view, range, key]);

	return {
		view,
		setView,
		range,
		setRange,
		data,
		authorized,
		error,
		loading,
	};
};
