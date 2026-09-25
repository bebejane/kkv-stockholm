'use client';

import { useEffect } from 'react';
import { DayView } from '@/components/calendar/DayView';
import { useBookingCalendarStore } from '@/components/calendar/hooks/useBookingCalendarStore';
import { tzDate } from '@/lib/dates';
import s from '@/components/calendar/Calendar.module.scss';

const today = tzDate(new Date(), 7);

export default function ScratchDayView() {
	useEffect(() => {
		const mk = (id: string, start: number, end: number, exclusive = false) => ({
			id,
			start: tzDate(today, start),
			end: tzDate(today, end),
			member: { firstName: 'A', lastName: id, user: 'you' },
			equipment: exclusive ? [{ id: 'e', title: 'X', exclusive: true }] : [],
			note: null,
		});
		useBookingCalendarStore.setState({
			range: [tzDate(today, 7), tzDate(today, 23)],
			bookings: [mk('0', 16, 18), mk('1', 18, 19), mk('2', 20, 21)] as AllBookingsSearchQuery['allBookings'],
			mode: 'edit',
			view: 'day',
		});
	}, []);

	return (
		<div id='calendar' className={s.calendar}>
			<DayView userId='you' visible={true} mode='edit' />
		</div>
	);
}