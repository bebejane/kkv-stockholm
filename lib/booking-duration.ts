import { differenceInCalendarDays, differenceInHours } from 'date-fns';
import { START_HOUR } from './constants';
import { tzDate, type DateType } from './dates';

export type BookingDuration = {
	days: number;
	hours: number;
};

/**
 * Converts a booking's start/end into the days/hours reported on a report.
 *
 * - counts whole calendar days between start and end
 * - the last day's hours are measured from the booking's own start when it spans
 *   a single day, otherwise from the working-day start (START_HOUR)
 * - if those last-day hours are more than 5 they count as one more day, otherwise
 *   they are added to the report as hours (5 h or less is still hours, matching
 *   the form: "Timmar (upp till 5h/d)" / "Dagar (mer än 5h/d)")
 */
export function getBookingDuration(start: DateType, end: DateType): BookingDuration {
	if (!start || !end) return { days: 0, hours: 0 };

	const startDate = tzDate(start);
	const endDate = tzDate(end);

	const fullDays = Math.max(differenceInCalendarDays(endDate, startDate), 0);
	const sameDay = differenceInCalendarDays(endDate, startDate) === 0;
	const lastDayStart = sameDay ? startDate : tzDate(end, START_HOUR);
	const lastHours = differenceInHours(endDate, lastDayStart);

	if (lastHours > 5) return { days: fullDays + 1, hours: 0 };
	return { days: fullDays, hours: Math.max(lastHours, 0) };
}
