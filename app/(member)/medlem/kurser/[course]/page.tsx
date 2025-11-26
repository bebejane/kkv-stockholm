import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as courseController from '@/lib/controller/course';
import { MemberCourseForm } from '@/components/forms/MemberCourseForm';
import { AllWorkshopsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import Link from 'next/link';

export default async function ReportPage({ params }: PageProps<'/medlem/kurser/[course]'>) {
	const session = await getMemberSession();
	const { course: id } = await params;
	const [course, { allWorkshops }] = await Promise.all([
		courseController.find(id),
		apiQuery(AllWorkshopsDocument, { revalidate: 0, all: true }),
	]);

	if (!course) return notFound();

	return (
		<article>
			<h1>Kurs</h1>
			<MemberCourseForm course={course} allWorkshops={allWorkshops} />
			<nav className='line back'>
				<Link href='/medlem/kurser'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/kurser/[course]'>): Promise<Metadata> {
	const { course: id } = await params;
	const course = await courseController.find(id);
	if (!course) return notFound();

	return buildMetadata({
		title: `Medlem — Kurser - ${course.title}`,
		pathname: `/medlem/kurser/${id}`,
	});
}
