import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as reportController from '@/lib/controller/report';
import * as workshopController from '@/lib/controller/workshop';
import { ReportForm } from '@/components/forms/ReportForm';

export default async function Booking({ params }: PageProps<'/medlem/rapporter/[report]'>) {
	const session = await getMemberSession();
	const { report: id } = await params;
	const report = await reportController.find(id);
	const workshops = await workshopController.findAll();
	if (!report) return notFound();

	return (
		<article>
			<h1>Rapportera tid från bokning</h1>
			<ReportForm member={session.member} report={report} workshops={workshops} />
			<nav className='line'>
				<Link href='/medlem/rapporter'>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({ params }: PageProps<'/medlem/rapporter/[report]'>): Promise<Metadata> {
	const { report: id } = await params;

	return buildMetadata({
		title: `Medlem — Rapporter - ${id}`,
		pathname: `/medlem/rapporter/${id}`,
	});
}
