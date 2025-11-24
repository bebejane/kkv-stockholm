import { buildMetadata } from '@/app/(website)/layout';
import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import * as workshopController from '@/lib/controller/workshop';
import { ReportForm } from '@/components/forms/ReportForm';

export default async function NewReportPage({ params }: PageProps<'/medlem/rapporter/ny'>) {
	const session = await getMemberSession();
	const workshops = await workshopController.findAll();

	return (
		<article>
			<h1>Ny rapport</h1>
			<ReportForm member={session.member} workshops={workshops} />
			<nav className='line'>
				<Link href='/medlem/rapporter'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/rapporter/ny'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Rapporter - Ny rapport`,
		pathname: `/medlem/rapporter/ny`,
	});
}
