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
	equipmentId?: string;
};

export const useBookingCalender = ({ view: _view, workshopId, equipmentId }: UseBookingCalenderProps) => {
	const { data: session } = authClient.useSession();
	const [view, setView] = useState<View['id']>(_view);
	const [range, setRange] = useState<[Date, Date]>([new Date(), new Date()]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [authorized, setAuthorized] = useState(false);
	const [data, setData] = useState<AllBookingsSearchQuery['allBookings'] | null>(null);
	const aborter = useRef<AbortController | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				console.log('fetch');

				const data = bookingSearchSchema.parse({
					start: startOfDay(range[0]).toISOString(),
					end: endOfDay(range[1]).toISOString(),
					workshopId,
					equipmentId,
				});

				aborter.current?.abort('AbortError');
				aborter.current = new AbortController();

				setError(null);
				setLoading(true);

				const url = `/api/booking/search`;
				const res = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
					signal: aborter.current?.signal,
				});

				setAuthorized(res.status === 401);

				if (res.status === 200) setData(await res.json());
				else throw `${res.status}: ${res.statusText}`;
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
	}, [view, range, workshopId, equipmentId]);

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
