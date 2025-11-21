import { buildMetadata } from '@/app/layout';
import { getSession } from '@/auth/utils';
import NewBookingForm from '@/components/forms/booking/NewBookingForm';
import { AllWorkshopsDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';

export default async function NewBooking({ params }: PageProps<'/medlem/bokningar/ny'>) {
	const session = await getSession();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });
	return (
		<article>
			<h1>Ny bokning</h1>
			<NewBookingForm allWorkshops={allWorkshops} />
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/bokningar/ny'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Bokningar — Ny Bokning`,
		pathname: `/medlem/bokningar/ny`,
	});
}
