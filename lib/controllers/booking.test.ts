import { getBookingDuration } from './booking';

describe('getBookingDuration', () => {
	it('calculates hours and days for a single day booking', () => {
		const start = new Date('2026-02-16T08:00:00');
		const end = new Date('2026-02-16T13:00:00');
		const result = getBookingDuration(start, end);
		expect(result).toEqual({ hours: 5, days: 0 });
	});

	it('counts a day if more than 5 hours are booked', () => {
		const start = new Date('2026-02-16T08:00:00');
		const end = new Date('2026-02-16T15:00:00');
		const result = getBookingDuration(start, end);
		expect(result).toEqual({ hours: 7, days: 1 });
	});

	it('handles bookings spanning multiple days', () => {
		const start = new Date('2026-02-15T20:00:00');
		const end = new Date('2026-02-16T10:00:00');
		const result = getBookingDuration(start, end);
		expect(result).toEqual({ hours: 6, days: 1 });
	});

	it('ignores hours outside 07:00 to 23:00', () => {
		const start = new Date('2026-02-16T06:00:00');
		const end = new Date('2026-02-16T23:30:00');
		const result = getBookingDuration(start, end);
		expect(result).toEqual({ hours: 16, days: 1 });
	});

	it('returns 0 hours and days for invalid ranges', () => {
		const start = new Date('2026-02-16T10:00:00');
		const end = new Date('2026-02-16T08:00:00');
		const result = getBookingDuration(start, end);
		expect(result).toEqual({ hours: 0, days: 0 });
	});

	it('handles bookings spanning multiple full days', () => {
		const start = new Date('2026-02-14T08:00:00');
		const end = new Date('2026-02-16T20:00:00');
		const result = getBookingDuration(start, end);
		expect(result).toEqual({ hours: 30, days: 3 });
	});
});
