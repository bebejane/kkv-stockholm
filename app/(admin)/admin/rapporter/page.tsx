import s from './page.module.scss';
import { buildMetadata } from '@/app/(website)/layout';
import { getAdminSession } from '@/auth/utils';
import { Metadata } from 'next';
import { addMonths, endOfMonth, format, setDefaultOptions } from 'date-fns';
import { sv } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';
import { AiOutlineFileExcel } from 'react-icons/ai';

export default async function AdminReportPage({ params }: PageProps<'/admin'>) {
	const session = await getAdminSession();

	setDefaultOptions({ locale: sv });

	const start = new Date('2026-01-01');
	const end = endOfMonth(addMonths(new Date(), -1));
	const years = Array.from({ length: end.getFullYear() - start.getFullYear() + 1 }, (_, i) => ({
		year: i + start.getFullYear(),
		months: Array.from({ length: 12 }, (_, i) => i).slice(
			0,
			start.getFullYear() + i === end.getFullYear() ? end.getMonth() + 2 : 12,
		),
	}));

	return (
		<article>
			<h1>Rapporter</h1>
			<div className={s.container}>
				<section className={s.reports}>
					<h3>Boknings rapporter</h3>
					{years.map(({ year, months }) => (
						<div key={year}>
							<h4>{year}</h4>
							<ul>
								{months.map((month) => {
									const date = new Date(year, month, 1);
									return (
										<li key={month}>
											<a
												href={`/api/excel/report?date=${format(date, 'yyyy-MM-dd')}`}
												download={`KKV boknings rapport - ${format(date, 'MMMM (yyyy)')}.xlsx`}
											>
												<AiOutlineFileExcel /> {capitalize(format(date, 'MMMM'))}
											</a>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</section>
				<section className={s.members}>
					<h3>Medlemmar</h3>
					<ul>
						<li>
							<a
								href={`/api/excel/members`}
								download={`KKV Medlemslista - ${format(start, 'yyyy-MM-dd')}.xlsx`}
							>
								<AiOutlineFileExcel /> Medlemslista
							</a>
						</li>
					</ul>
				</section>
			</div>
		</article>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/admin/rapporter'>): Promise<Metadata> {
	return buildMetadata({
		title: `Admin - Rapporter`,
		pathname: `/admin/rapporter`,
	});
}
