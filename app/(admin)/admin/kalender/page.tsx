import s from './page.module.scss';
import { CalendarAdmin } from '@/app/(admin)/admin/kalender/CalendarAdmin';
import { buildMetadata } from '@/app/(website)/layout';
import { getAdminSession } from '@/auth/utils';
import { AllWorkshopsDocument } from '@/graphql';
import { Metadata } from 'next';
import { apiQuery } from 'next-dato-utils/api';

export default async function AdminCalendarPage({ params }: PageProps<'/admin/kalender'>) {
	const session = await getAdminSession();
	const { allWorkshops } = await apiQuery(AllWorkshopsDocument, { all: true });
	return <CalendarAdmin allWorkshops={allWorkshops} />;
}

export async function generateMetadata({
	params,
}: PageProps<'/admin/kalender'>): Promise<Metadata> {
	return buildMetadata({
		title: `Admin - Kalender`,
		pathname: `/admin/kalendar`,
	});
}
