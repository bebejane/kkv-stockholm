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
	// Create an array of years with an array of months
	const years = Array.from({ length: end.getFullYear() - start.getFullYear() + 1 }, (_, i) => ({
		year: i + start.getFullYear(),
		months: Array.from({ length: 12 }, (_, i) => i).slice(0, end.getMonth() + 2),
	}));

	return (
		<Canvas ctx={ctx}>
			<section className={s.reports}>
				{years.map(({ year, months }) => (
					<div key={year}>
						<h3>{year}</h3>
						<ul>
							{months.map((month) => (
								<li>
									<a
										download
										key={month}
										href={`/api/generate-report?date=${format(new Date(year, month, 1), 'yyyy-MM-dd')}`}
									>
										{format(new Date(year, month, 1), 'MMMM')}
									</a>
								</li>
							))}
						</ul>
					</div>
				))}
			</section>
		</Canvas>
	);
}
