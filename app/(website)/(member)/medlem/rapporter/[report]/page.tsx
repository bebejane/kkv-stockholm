import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as reportController from '@/lib/controllers/report';
import { linkId } from '@/lib/controllers/utils';
import { ReportForm } from '@/components/forms/ReportForm';
import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument } from '@/graphql';

export default async function ReportPage({ params }: PageProps<'/medlem/rapporter/[report]'>) {
	const session = await getMemberSession();
	const { report: id } = await params;
	const report = await reportController.find(id);
	if (!report || linkId(report.member) !== session.member.id) return notFound();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });

	return (
		<article>
			<h1>{metadata.title as string}</h1>
			<ReportForm member={session.member} report={report} allWorkshops={allWorkshops} />
			<nav className='line back'>
				<Link href='/medlem/rapporter'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Rapportera tid',
};
