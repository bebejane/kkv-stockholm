import { getMemberSession } from '@/auth/utils';
import { AllWorkshopsFormDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { BookingForm } from '@/components/forms/booking/BookingForm';

export default async function NewBookingPage({
	params,
	searchParams,
}: PageProps<'/medlem/bokningar/ny'>) {
	const session = await getMemberSession();
	const { allWorkshops, bookingHelp } = await apiQuery(AllWorkshopsFormDocument, {
		revalidate: 0,
		all: true,
	});
	const { wid } = await searchParams;

	return (
		<article>
			<h1>{metadata.title as string}</h1>
			<BookingForm
				allWorkshops={allWorkshops}
				help={bookingHelp}
				workshopId={wid as string}
				session={session}
			/>
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Ny bokning',
};
