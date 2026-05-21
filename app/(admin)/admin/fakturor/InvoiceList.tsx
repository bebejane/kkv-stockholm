'use client';
import { Button } from '@mantine/core';
import s from './InvoiceList.module.scss';
import cn from 'classnames';
import { useState } from 'react';
import { format, setDefaultOptions } from 'date-fns';
import Link from 'next/link';
import { sv } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';

type InvoiceListProps = {
	reports: AllReportsQuery['allReports'];
};

export function InvoiceList({ reports }: InvoiceListProps) {
	setDefaultOptions({ locale: sv });

	const [open, setOpen] = useState(false);
	const [months, setMonths] = useState<Record<string, boolean>>({});
	const [toggles, setToggles] = useState<Record<string, boolean>>({});
	const month = capitalize(format(reports[0].date, 'MMMM yyyy'));

	const reportsByMember = reports
		.reduce(
			(acc, report) => {
				const index = acc.findIndex(({ member }) => member.id === report.member.id);
				if (index === -1) acc.push({ member: report.member, reports: [report] });
				else acc[index].reports.push(report);
				return acc;
			},
			[] as {
				member: AllReportsQuery['allReports'][number]['member'];
				reports: AllReportsQuery['allReports'];
			}[],
		)
		.map(({ member, reports }) => ({
			member,
			reports: reports.sort((a, b) => a.date.localeCompare(b.date)),
		}))
		.sort((a, b) => a.member.firstName.localeCompare(b.member.firstName));

	return (
		<section className={s.month}>
			<header onClick={() => setMonths((m) => ({ ...m, [month]: !m[month] }))}>
				<div className={s.date}>
					<h1 onClick={() => setOpen(!open)}>
						{month} <button className={cn(open && s.open)}>❯</button>
					</h1>
				</div>
			</header>
			<ul className={cn(s.members, months[month] && s.open)}>
				{reportsByMember.map(({ member, reports }) => (
					<li
						key={member.id}
						onClick={() => setToggles((t) => ({ ...t, [member.id]: !t[member.id] }))}
					>
						<header className={cn(toggles[member.id] && s.open)}>
							<div className={s.name}>
								{member.firstName} {member.lastName}
							</div>
							<div className={s.reports}>{reports.length} rapporter</div>
							<button className={cn(s.arrow, toggles[member.id] && s.open)}>❯</button>
						</header>
						<ul className={cn(s.reportList, toggles[member.id] && s.open)}>
							{reports.map((report) => (
								<li key={report.id}>
									<div className={s.equipment}>
										{report.booking?.workshop.title}&nbsp;
										{report.booking?.equipment.length
											? `(${report.booking?.equipment.map((e) => (e.titleShort || e.title)?.trim()).join(', ')})`
											: ''}
									</div>
									<div className={s.date}>{format(report.date, 'dd MMM').toLowerCase()}</div>
									<div className={s.hours}>{report.hours ? `${report.hours}h` : ''}</div>
									<div className={s.days}>{report.days ? `${report.days}d` : ''}</div>
									<div className={s.extra}>{report.extraCost ? `${report.extraCost}kr` : ''}</div>
									<div className={s.total}>3000kr</div>
									<div className={s.edit}>
										<Link href={report._editingUrl ?? ''} target='_blank'>
											Redigera
										</Link>
									</div>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</section>
	);
}
