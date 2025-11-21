import s from './page.module.scss';
import { AllBookingsDocument } from '@/graphql';

import { BookingCalender } from '@/components/booking/BookingCalender';
import { apiQuery } from 'next-dato-utils/api';

export default async function CalenderPage({ params }: PageProps<'/calender'>) {
	return (
		<article>
			<BookingCalender />
		</article>
	);
}
