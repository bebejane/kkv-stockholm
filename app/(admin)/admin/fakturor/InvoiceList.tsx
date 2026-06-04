'use client';

import { Button } from '@mantine/core';
import s from './InvoiceList.module.scss';
import cn from 'classnames';
import { useState } from 'react';
import { format, setDefaultOptions } from 'date-fns';
import Link from 'next/link';
import { sv } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';
import { useRouter } from 'next/navigation';
import { calculateReportCost } from '@/lib/spiris/cost';

type InvoiceListProps = {
	reports: AllReportsQuery['allReports'];
	month: number;
	year: number;
};

const baseSprisCustomerInvoiceUrl = 'https://eaccounting.vismaonline.com/#/sales/customerinvoice/';

export function InvoiceList({ reports, month, year }: InvoiceListProps) {
	setDefaultOptions({ locale: sv });

	const [open, setOpen] = useState(false);
	const [months, setMonths] = useState<Record<string, boolean>>({});
	const [toggles, setToggles] = useState<Record<string, boolean>>({});
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitResult, setSubmitResult] = useState<{
		successful: number;
		failed: number;
	} | null>(null);
	const router = useRouter();

	const monthLabel = capitalize(format(reports[0].date, 'MMMM yyyy'));

	const allInvoiced = reports.every((r) => r.invoiceNo);

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

	const handleSubmit = async () => {
		setSubmitting(true);
		setSubmitError(null);
		setSubmitResult(null);

		try {
			const response = await fetch('/api/spiris/submit-month', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ month, year }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to submit invoices');
			}

			const result = await response.json();
			setSubmitResult({
				successful: result.successful,
				failed: result.failed,
			});

			if (result.failed > 0) {
				const errors = result.results
					.filter((r: any) => !r.success)
					.map((r: any) => `${r.memberEmail}: ${r.error}`)
					.join(', ');
				setSubmitError(`${result.failed} fakturor misslyckades: ${errors}`);
			}
			router.refresh();
		} catch (e) {
			setSubmitError(e instanceof Error ? e.message : 'Unknown error');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className={s.month}>
			<header onClick={() => setMonths((m) => ({ ...m, [monthLabel]: !m[monthLabel] }))}>
				<div className={s.date}>
					<h1 onClick={() => setOpen(!open)}>
						{monthLabel} <button className={cn(open && s.open)}>❯</button>
					</h1>
					<div className={s.actions}>
						{allInvoiced ? (
							<span className={s.invoicedBadge}>Fakturerad</span>
						) : (
							<Button
								size='xs'
								loading={submitting}
								onClick={(e) => {
									e.stopPropagation();
									handleSubmit();
								}}
							>
								Skicka in
							</Button>
						)}
					</div>
				</div>
				{submitResult && (
					<div className={s.submitResult}>
						{submitResult.successful > 0 && (
							<span className={s.successCount}>{submitResult.successful} skickade</span>
						)}
						{submitResult.failed > 0 && (
							<span className={s.failCount}>{submitResult.failed} misslyckades</span>
						)}
					</div>
				)}
				{submitError && <div className={s.submitError}>{submitError}</div>}
			</header>
			<ul className={cn(s.members, months[monthLabel] && s.open)}>
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
										{report.booking?.workshop.title ?? report.workshop.title}&nbsp;
										{report.booking?.equipment.length
											? `(${report.booking?.equipment.map((e) => (e.titleShort || e.title)?.trim()).join(', ')})`
											: ''}
									</div>
									<div className={s.date}>{format(report.date, 'dd MMM').toLowerCase()}</div>
									<div className={s.hours}>{report.hours ? `${report.hours}h` : ''}</div>
									<div className={s.days}>{report.days ? `${report.days}d` : ''}</div>
									<div className={s.extra}>{report.extraCost ? `${report.extraCost}kr` : ''}</div>
									<div className={s.total}>{calculateReportCost(report as any)}kr</div>
									{report.invoiceNo && report.invoiceId && (
										<div className={s.invoiceNo}>
											<Link
												href={`${baseSprisCustomerInvoiceUrl}${report.invoiceId}`}
												target='_blank'
												rel='noreferrer'
												onClick={(e) => e.stopPropagation()}
											>
												#{report.invoiceNo}
											</Link>
										</div>
									)}
									<div className={s.edit}>
										<Link
											href={report._editingUrl ?? ''}
											target='_blank'
											aria-disabled={report.invoiceNo ? true : false}
											onClick={(e) => e.stopPropagation()}
										>
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
