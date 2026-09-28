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
 * - on the last day the hours are measured from the working-day start (START_HOUR)
 * - if those last-day hours are >= 5 they count as one more day, otherwise they
 *   are added to the report as hours
 */
export function getBookingDuration(start: DateType, end: DateType): BookingDuration {
	const startDate = tzDate(start);
	const endDate = tzDate(end);

	const fullDays = Math.max(differenceInCalendarDays(endDate, startDate), 0);
	const lastDayStart = tzDate(end, START_HOUR);
	const lastHours = differenceInHours(endDate, lastDayStart);

	if (lastHours >= 5) return { days: fullDays + 1, hours: 0 };

	return { days: fullDays, hours: Math.max(lastHours, 0) };
}
