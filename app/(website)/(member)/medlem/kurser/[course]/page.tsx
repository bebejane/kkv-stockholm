import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as courseController from '@/lib/controllers/course';
import { CourseForm } from '@/components/forms/CourseForm';
import { AllWorkshopsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import Link from 'next/link';

export default async function ReportPage({ params }: PageProps<'/medlem/kurser/[course]'>) {
	return notFound();
	const session = await getMemberSession();
	const { course: id } = await params;
	const [course, { allWorkshops }] = await Promise.all([
		courseController.find(id),
		apiQuery(AllWorkshopsDocument, { revalidate: 0, all: true }),
	]);

	if (!course) return notFound();

	return (
		<article>
			<h1>{metadata.title as string}</h1>
			<CourseForm course={course} allWorkshops={allWorkshops} />
			<nav className='line back'>
				<Link href='/medlem/kurser'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Kurs',
};
