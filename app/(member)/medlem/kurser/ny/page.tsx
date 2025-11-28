import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { CourseForm } from '@/components/forms/CourseForm';
import { AllWorkshopsDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';

export default async function NewBookingPage({ params }: PageProps<'/medlem/kurser/ny'>) {
	const session = await getMemberSession();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { revalidate: 0, all: true });

	return (
		<article>
			<h1>Ny kurs</h1>
			<CourseForm allWorkshops={allWorkshops} />
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/kurser/ny'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Kurser — Ny Kurs`,
		pathname: `/medlem/kurser/ny`,
	});
}
