import { getMemberSession } from '@/auth/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatBookingDate, formatDate } from '@/lib/dates';
import { linkId } from '@/lib/controllers/utils';
import Link from 'next/link';
import * as bookingController from '@/lib/controllers/booking';
import * as reportController from '@/lib/controllers/report';
import { ReportForm } from '@/components/forms/ReportForm';
import { apiQuery } from 'next-dato-utils/api';
import { AllWorkshopsDocument } from '@/graphql';

export default async function BookingReportPagePage({
	params,
}: PageProps<'/medlem/bokningar/[booking]/rapportera'>) {
	const { booking: id } = await params;

	const [session, booking, report, { allWorkshops }] = await Promise.all([
		getMemberSession(),
		bookingController.find(id),
		reportController.findByBookingId(id),
		apiQuery(AllWorkshopsDocument, { all: true }),
	]);

	if (!booking || linkId(booking.member) !== session.member.id) return notFound();

	const { workshop, equipment } = booking;

	return (
		<article>
			<h1>{metadata.title as string}</h1>
			<p className='intro'>
				Du hade en tidigare bokning den {formatBookingDate(booking)} i {workshop?.title_long},{' '}
				{equipment.map(({ title }) => title).join(', ')}
			</p>
			<ReportForm
				member={session.member}
				booking={booking}
				report={report}
				allWorkshops={allWorkshops}
			/>
			<nav className='line back'>
				<Link href={`/medlem/rapporter`}>Tillbaka</Link>
			</nav>
		</article>
	);
}

export const metadata: Metadata = {
	title: 'Rapportera bokning',
};
