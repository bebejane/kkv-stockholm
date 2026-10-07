import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as reportController from '@/lib/controllers/report';
import { linkId } from '@/lib/controllers/utils';
import { ReportForm } from '@/components/forms/ReportForm';
import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument, ReportHelpDocument } from '@/graphql';

export default async function ReportPage({ params }: PageProps<'/medlem/rapporter/[report]'>) {
	const session = await getMemberSession();
	const { report: id } = await params;
	const report = await reportController.find(id);
	if (!report || linkId(report.member) !== session.member.id) return notFound();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });
	const { reportHelp } = await apiQuery(ReportHelpDocument, { revalidate: 0 });

	return (
		<article>
			<h1>{metadata.title as string}</h1>
			<ReportForm
				key={report.id}
				member={session.member}
				report={report}
				allWorkshops={allWorkshops}
				help={reportHelp}
			/>
			<nav className='line back'>
				<Link href='/medlem/rapporter'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Rapportera tid',
};
