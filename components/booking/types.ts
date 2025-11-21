export type BookingHour = {
	start: string;
	end: string;
	b?: BookingRecord;
};

export type BookingDay = {
	name: string;
	hours: BookingHour[];
};
