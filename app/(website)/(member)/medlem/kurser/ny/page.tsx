import { getMemberSession } from '@/auth/utils';
import { CourseForm } from '@/components/forms/CourseForm';
import { AllWorkshopsDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';

export default async function NewBookingPage({ params }: PageProps<'/medlem/kurser/ny'>) {
	return notFound();
	const session = await getMemberSession();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { revalidate: 0, all: true });

	return (
		<article>
			<h1>{metadata.title as string}</h1>
			<CourseForm allWorkshops={allWorkshops} />
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Ny kurs',
};
