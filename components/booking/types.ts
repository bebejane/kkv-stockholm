export type BookingHour = {
	start: string;
	end: string;
	b?: BookingRecord;
};

export type BookingDay = {
	name: string;
	hours: BookingHour[];
};

export type CalendarView = {
	id: 'day' | 'week' | 'month';
	title: string;
};
