'use client';

import type { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, Toolbar, ToolbarTitle, ToolbarStack } from 'datocms-react-ui';
import { useMemo, useState } from 'react';
import { addMonths, endOfMonth, format, setDefaultOptions } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';
import s from './DownloadsPage.module.scss';
import { getDatoClientConfig } from '../utils/useDatoClient';
import { downloadFile, type DownloadOption } from '../utils/downloads-utils';

type PropTypes = { ctx: RenderPageCtx };

export function DownloadsPage({ ctx }: PropTypes) {
	const config = useMemo(() => getDatoClientConfig(ctx), [ctx]);
	const [busy, setBusy] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const { months, years, startDate } = useMemo(() => {
		setDefaultOptions({ locale: enUS });
		const start = new Date('2026-01-01');
		const end = endOfMonth(addMonths(new Date(), -1));
		const years = Array.from({ length: end.getFullYear() - start.getFullYear() + 1 }, (_, i) => ({
			year: i + start.getFullYear(),
			months: Array.from({ length: 12 }, (_, i) => i).slice(
				0,
				start.getFullYear() + i === end.getFullYear() ? end.getMonth() + 2 : 12,
			),
		}));
		return { months: years, years: years.map(({ year }) => year), startDate: start };
	}, []);

	async function handleClick(option: DownloadOption) {
		if (!config) return;
		setBusy(option.filename);
		setError(null);
		try {
			await downloadFile(option.url, option.filename, config.token);
			ctx.notice(`${option.label} downloaded`);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Unknown error');
			ctx.alert(e instanceof Error ? e.message : 'Unknown error');
		} finally {
			setBusy(null);
		}
	}

	return (
		<Canvas ctx={ctx} noAutoResizer>
			<div className={s.container}>
				<Toolbar>
					<ToolbarStack style={{ justifyContent: 'flex-start', minHeight: 60 }}>
						<ToolbarTitle>Downloads</ToolbarTitle>
					</ToolbarStack>
				</Toolbar>
				<div className={s.content}>
					<section>
						<h3>Booking reports</h3>
						{months.map(({ year, months }) => (
							<div key={year} className={s.year}>
								<h4>{year}</h4>
								<ul>
									{months.map((month) => {
										const date = new Date(year, month, 1);
										const formatted = format(date, 'yyyy-MM-dd');
										const option: DownloadOption = {
											label: capitalize(format(date, 'MMMM')),
											url: `/api/excel/report?date=${formatted}`,
											filename: `KKV booking report - ${format(date, 'MMMM (yyyy)')}.xlsx`,
										};
										return (
											<li key={month}>
												<Button
													fullWidth
													buttonType='muted'
													buttonSize='s'
													onClick={() => handleClick(option)}
													disabled={busy === option.filename}
												>
													{capitalize(format(date, 'MMMM'))}
												</Button>
											</li>
										);
									})}
								</ul>
							</div>
						))}
					</section>
					<section>
						<h3>Members</h3>
						<Button
							buttonSize='m'
							onClick={() =>
								handleClick({
									label: 'Members list',
									url: '/api/excel/members',
									filename: `KKV member list - ${format(startDate, 'yyyy-MM-dd')}.xlsx`,
								})
							}
						>
							Members list
						</Button>
					</section>
					{error && <p className={s.error}>{error}</p>}
				</div>
			</div>
		</Canvas>
	);
}
