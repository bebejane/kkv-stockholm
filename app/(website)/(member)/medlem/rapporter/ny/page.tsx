import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { ReportForm } from '@/components/forms/ReportForm';
import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument, ReportHelpDocument } from '@/graphql';
import Content from '@/components/content/Content';

export default async function NewReportPage({ params }: PageProps<'/medlem/rapporter/ny'>) {
	const session = await getMemberSession();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });
	const { reportHelp } = await apiQuery(ReportHelpDocument, { revalidate: 0 });

	return (
		<article>
			<h1>{metadata.title as string}</h1>
			<ReportForm member={session.member} allWorkshops={allWorkshops} help={reportHelp} />
			<nav className='line back'>
				<Link href='/medlem/rapporter'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Ny rapport',
};
