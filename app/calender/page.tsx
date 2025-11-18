import s from './page.module.scss';
import { AllBookingsDocument } from '@/graphql';

import Bookings from '@/components/calender';
import { apiQuery } from 'next-dato-utils/api';

export default async function CalenderPage({ params }: PageProps<'/calender'>) {
	const { allBookings } = await apiQuery(AllBookingsDocument, { all: true });
	const booking = allBookings[0];
	return (
		<article>
			<Bookings />
		</article>
	);
}
