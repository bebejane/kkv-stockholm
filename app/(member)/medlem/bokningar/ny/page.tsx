import { buildMetadata } from '@/app/(website)/layout';
import { getMemberSession } from '@/auth/utils';
import NewBookingForm from '@/components/booking/NewBookingForm';
import { AllWorkshopsDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';

export default async function NewBookingPage({ params }: PageProps<'/medlem/bokningar/ny'>) {
	const session = await getMemberSession();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { revalidate: 0, all: true });

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
