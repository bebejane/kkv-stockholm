import { buildMetadata } from '@/app/layout';
import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import * as bookingController from '@/lib/controller/booking';
import * as workshopController from '@/lib/controller/workshop';
import * as reportController from '@/lib/controller/report';
import { ReportForm } from '@/components/forms/ReportForm';

export default async function BookingReportPage({ params }: PageProps<'/medlem/bokningar/[booking]/rapportera'>) {
	console.time('BookingReportPage');
	const session = await getMemberSession();
	const { booking: id } = await params;

	const [booking, report, workshops] = await Promise.all([
		bookingController.find(id),
		reportController.findByBookingId(id),
		workshopController.findAll(),
	]);

	if (!booking) return notFound();
	const { start, workshop, equipment } = booking;

	console.timeEnd('BookingReportPage');

	return (
		<article>
			<h1>Rapportera bokning</h1>
			<p className='intro'>
				Du hade en tidigare bokning den {formatDate(start)} i {workshop?.title_long},{' '}
				{equipment.map(({ title }) => title).join(', ')}
			</p>
			<ReportForm member={session.member} booking={booking} report={report} workshops={workshops} />
			<nav className='line'>
				<Link href={`/medlem/bokningar/${id}`}>Tillbaka</Link>
			</nav>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/medlem/bokningar/[booking]/rapportera'>): Promise<Metadata> {
	const { booking: id } = await params;
	return buildMetadata({
		title: `Medlem — Bokning - Rapportera`,
		pathname: `/medlem/bokningar/${id}/rapportera`,
	});
}
