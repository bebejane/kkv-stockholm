import s from './page.module.scss';
import { buildMetadata } from '@/app/(website)/layout';
import { getAdminSession } from '@/auth/utils';
import { Metadata } from 'next';
import { addMonths, endOfMonth, format, setDefaultOptions } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@mantine/core';
import { apiQuery } from 'next-dato-utils/api';
import { AllReportsDocument } from '@/graphql';
import { InvoiceList } from './InvoiceList';

export default async function AdminInvoicingPage({ params }: PageProps<'/admin'>) {
	const session = await getAdminSession();

	const { allReports } = await apiQuery(AllReportsDocument, {
		all: true,
	});

	const reportsByMonth = allReports
		.reduce(
			(acc, report) => {
				const index = acc.findIndex(
					({ date }) => new Date(date).getMonth() === new Date(report.date).getMonth(),
				);
				if (index === -1) acc.push({ date: new Date(report.date), reports: [report] });
				else acc[index].reports.push(report);
				return acc;
			},
			[] as {
				date: AllReportsQuery['allReports'][number]['date'];
				reports: AllReportsQuery['allReports'];
			}[],
		)
		.map(({ date, reports }) => ({
			date,
			reports: reports.sort((a, b) => a.date.localeCompare(b.date)),
		}))
		.sort((a, b) => b.date.getTime() - a.date.getTime());

	return (
		<article className={s.container}>
			<Button className={s.submit}>Skicka in</Button>
			{reportsByMonth.map(({ date, reports }, idx) => (
				<InvoiceList key={idx} reports={reports} />
			))}
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/admin/fakturor'>): Promise<Metadata> {
	return buildMetadata({
		title: `Admin - Fakturor`,
		pathname: `/admin/fakturor`,
	});
}
