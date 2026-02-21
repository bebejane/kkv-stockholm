import s from './ReportPage.module.scss';
import { addMonths, endOfMonth, format } from 'date-fns';
import { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';

type PropTypes = {
	ctx: RenderPageCtx;
};

const start = new Date('2026-01-01');

export function ReportPage({ ctx }: PropTypes) {
	const end = endOfMonth(addMonths(new Date(), -1));
	const years = Array.from({ length: end.getFullYear() - start.getFullYear() + 1 }, (_, i) => ({
		year: i + start.getFullYear(),
		months: Array.from({ length: 12 }, (_, i) => i).slice(
			0,
			start.getFullYear() + i === end.getFullYear() ? end.getMonth() + 2 : 12,
		),
	}));

	return (
		<Canvas ctx={ctx}>
			<div className={s.container}>
				<section className={s.reports}>
					<h3>Rapporter</h3>
					{years.map(({ year, months }) => (
						<div key={year}>
							<h4>{year}</h4>
							<ul>
								{months.map((month) => {
									const date = new Date(year, month, 1);
									return (
										<li key={month}>
											<a
												key={month}
												download={`KKV boknings rapport - ${format(date, 'MMMM (yyyy)')}.xlsx`}
												href={`/api/excel/report?date=${format(date, 'yyyy-MM-dd')}`}
											>
												{format(date, 'MMMM')}
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
					<a
						href={`/api/excel/members`}
						download={`KKV Medlemslista - ${format(start, 'yyyy-MM-dd')}.xlsx`}
					>
						Ladda ner lista
					</a>
				</section>
			</div>
		</Canvas>
	);
}
