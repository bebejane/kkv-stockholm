import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { ReportForm } from '@/components/forms/ReportForm';
import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument } from '@/graphql';

export default async function NewReportPage({ params }: PageProps<'/medlem/rapporter/ny'>) {
	const session = await getMemberSession();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });

	return (
		<article>
			<h1>Ny rapport</h1>
			<ReportForm member={session.member} allWorkshops={allWorkshops} />
			<nav className='line back'>
				<Link href='/medlem/rapporter'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/medlem/rapporter/ny'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Rapporter - Ny rapport`,
		pathname: `/medlem/rapporter/ny`,
	});
}
