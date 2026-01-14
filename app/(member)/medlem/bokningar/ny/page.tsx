import { buildMetadata } from '@/app/layout';
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
	const { allWorkshops } = await apiQuery(AllWorkshopsFormDocument, { revalidate: 0, all: true });
	const { wid } = await searchParams;

	return (
		<article>
			<h1>Ny bokning</h1>
			<BookingForm allWorkshops={allWorkshops} workshopId={wid as string} session={session} />
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/medlem/bokningar/ny'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Bokningar — Ny Bokning`,
		pathname: `/medlem/bokningar/ny`,
	});
}
