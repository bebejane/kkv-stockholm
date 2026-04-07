import s from './page.module.scss';
import { buildMetadata } from '@/app/(website)/layout';
import { getMemberSession } from '@/auth/utils';
import { Button } from '@mantine/core';
import { Metadata } from 'next';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { formatDate, tzDate } from '@/lib/dates';
import { AllBookingsByMemberDocument, AllReportsByMemberDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { isAfter } from 'date-fns';
import { ListSection } from '@/components/common/ListSection';

export default async function ReportsPage({ params }: PageProps<'/medlem/rapporter'>) {
	const session = await getMemberSession();
	const [{ allReports }, { allBookings }] = await Promise.all([
		apiQuery(AllReportsByMemberDocument, {
			revalidate: 0,
			all: true,
			variables: { memberId: session.member.id },
		}),
		apiQuery(AllBookingsByMemberDocument, {
			revalidate: 0,
			all: true,
			variables: { memberId: session.member.id },
		}),
	]);

	const unreportedBookings = allBookings
		.filter(({ end }) => isAfter(tzDate(new Date()), tzDate(end)))
		.filter((b) => !b.report && !allReports.find((r) => r.booking?.id === b.id));

	return (
		<article>
			<h1 className={s.headline}>Rapportera</h1>
			<Link href='/medlem/rapporter/ny'>
				<Button>Ny rapport</Button>
			</Link>
			<ListSection
				title='Bokningar som inte rapporterats klart'
				empty='Inga bokningar att rapportera'
				items={unreportedBookings.map(({ id, start, workshop, equipment }) => ({
					id,
					href: `/medlem/bokningar/${id}/rapportera`,
					columns: [
						formatDate(start, 'short'),
						workshop?.title,
						equipment.map(({ title }) => title).join(', '),
					],
				}))}
			/>
			<ListSection
				title='Rapporterat de sex senaste månaderna'
				empty='Det finns inga rapporteringar ännu'
				items={allReports.map(({ id, workshop, date, days, hours, extraCost }) => ({
					id,
					href: `/medlem/rapporter/${id}`,
					columns: [
						formatDate(date, 'short'),
						workshop?.title,
						[hours ? `${hours}h` : null, days ? `${days}d` : null].filter(Boolean).join(', '),
						formatPrice(extraCost),
					],
				}))}
			/>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/medlem/rapporter'>): Promise<Metadata> {
	return buildMetadata({
		title: `Medlem — Rapporter`,
		pathname: `/medlem/rapporter`,
	});
}
