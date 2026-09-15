'use client';

import cn from 'classnames';
import type { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, Spinner, Toolbar, ToolbarTitle, ToolbarStack } from 'datocms-react-ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, setDefaultOptions } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';
import s from './InvoicesPage.module.scss';
import { getDatoClientConfig } from '../utils/useDatoClient';
import { datoQuery } from '../utils/dato-query';
import { AllReportsDocument } from '@/graphql';
import type { SubmitMonthResult } from '@/lib/controllers/spiris';
import { calculateReportCost } from '@/lib/spiris/cost';

const baseSpirisCustomerInvoiceUrl = 'https://eaccounting.vismaonline.com/#/sales/customerinvoice/';

type Report = AllReportsQuery['allReports'][number];
type MonthGroup = { key: string; count: number; reports: Report[] };
type PropTypes = { ctx: RenderPageCtx };

export function InvoicesPage({ ctx }: PropTypes) {
	const config = useMemo(() => getDatoClientConfig(ctx), [ctx]);
	const [reports, setReports] = useState<AllReportsQuery['allReports'] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState<string[]>([]);
	const [openMembers, setOpenMembers] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState<string | null>(null);
	const [progress, setProgress] = useState<Record<string, { done: number; total: number } | null>>(
		{},
	);
	const [invoiceStatus, setInvoiceStatus] = useState<Record<string, 'sending' | 'sent' | 'failed'>>(
		{},
	);
	const [results, setResults] = useState<
		Record<string, { type: 'success' | 'error'; message: string } | undefined>
	>({});

	const fetchReports = useCallback(() => {
		if (!config) return Promise.resolve();
		setError(null);
		return datoQuery<AllReportsQuery>(config, AllReportsDocument, { includeDrafts: true })
			.then((data) => setReports((data.allReports ?? []) as AllReportsQuery['allReports']))
			.catch((e) => setError(e instanceof Error ? e.message : 'Failed to fetch reports'));
	}, [config]);

	useEffect(() => {
		fetchReports();
	}, [fetchReports]);

	const reportsByMonth = useMemo<MonthGroup[]>(() => {
		setDefaultOptions({ locale: enUS });
		if (!reports) return [];
		return reports
			.reduce((acc, report) => {
				const key = format(new Date(report.date), 'MMMM yyyy');
				const index = acc.findIndex((g) => g.key === key);
				if (index === -1) acc.push({ key, count: 1, reports: [report] });
				else {
					acc[index].count += 1;
					acc[index].reports.push(report);
				}
				return acc;
			}, [] as MonthGroup[])
			.map(({ key, reports }) => ({
				key,
				count: reports.length,
				reports: reports.sort((a, b) => a.date.localeCompare(b.date)),
			}))
			.sort(
				(a, b) => new Date(b.reports[0].date).getTime() - new Date(a.reports[0].date).getTime(),
			);
	}, [reports]);

	const reportsByMember = (reports: Report[]) =>
		reports
			.reduce(
				(acc, report) => {
					const index = acc.findIndex(({ member }) => member.id === report.member.id);
					if (index === -1) acc.push({ member: report.member, reports: [report] });
					else acc[index].reports.push(report);
					return acc;
				},
				[] as { member: Report['member']; reports: Report[] }[],
			)
			.sort((a, b) => a.member.firstName.localeCompare(b.member.firstName));

	const toggle = (key: string) =>
		setOpen((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

	const toggleMember = (key: string) =>
		setOpenMembers((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

	type StreamEvent =
		| { type: 'start'; total: number }
		| { type: 'member'; done: number; total: number; result: SubmitMonthResult }
		| {
				type: 'done';
				total: number;
				successful: number;
				failed: number;
				results: SubmitMonthResult[];
		  }
		| { type: 'error'; error: string };

	async function handleSubmit(monthLabel: string, reportList: Report[]) {
		if (!config || submitting) return;
		setSubmitting(monthLabel);

		const memberIds = [...new Set(reportList.map((r) => r.member.id))];
		const statuses = Object.fromEntries(memberIds.map((id) => [id, 'sending' as const]));
		setInvoiceStatus((prev) => ({ ...prev, ...statuses }));
		setResults((prev) => ({ ...prev, [monthLabel]: undefined }));

		try {
			const sample = new Date(reportList[0].date);
			const response = await fetch('/api/spiris/submit-month', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${config.token}`,
				},
				body: JSON.stringify({ month: sample.getMonth(), year: sample.getFullYear() }),
			});

			if (!response.ok || !response.body) {
				const result = await response.json().catch(() => null);
				throw new Error(result?.error || 'Failed to create invoices');
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
			let summary: { successful: number; failed: number } | null = null;
			let streamError: string | null = null;

			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop() ?? '';

				for (const line of lines) {
					if (!line.trim()) continue;
					const event = JSON.parse(line) as StreamEvent;
					if (event.type === 'start') {
						setProgress((prev) => ({ ...prev, [monthLabel]: { done: 0, total: event.total } }));
					} else if (event.type === 'member') {
						setProgress((prev) => ({
							...prev,
							[monthLabel]: { done: event.done, total: event.total },
						}));
						setInvoiceStatus((prev) => ({
							...prev,
							[event.result.memberId]: event.result.success ? 'sent' : 'failed',
						}));
					} else if (event.type === 'done') {
						summary = { successful: event.successful, failed: event.failed };
					} else if (event.type === 'error') {
						streamError = event.error;
					}
				}
			}

			if (streamError) throw new Error(streamError);

			const message = summary
				? `${summary.successful} sent, ${summary.failed} failed`.trim()
				: 'No invoices to send';
			setResults((prev) => ({
				...prev,
				[monthLabel]: { type: 'success', message },
			}));
			await fetchReports();
		} catch (e) {
			setResults((prev) => ({
				...prev,
				[monthLabel]: {
					type: 'error',
					message: e instanceof Error ? e.message : 'Unknown error',
				},
			}));
		} finally {
			setSubmitting(null);
			//setProgress((prev) => ({ ...prev, [monthLabel]: null }));
			setInvoiceStatus((prev) => {
				const next = { ...prev };
				for (const id of memberIds) delete next[id];
				return next;
			});
		}
	}

	async function handleEditReport(e: React.MouseEvent<HTMLTableRowElement>) {
		const reportId = e.currentTarget.dataset.reportId;
		if (!reportId) return;
		const res = await ctx.editItem(reportId);
		console.log(res);
	}

	return (
		<Canvas ctx={ctx} noAutoResizer>
			<div className={s.container}>
				<Toolbar>
					<ToolbarStack style={{ justifyContent: 'flex-start', minHeight: 60 }}>
						<ToolbarTitle>Invoices</ToolbarTitle>
					</ToolbarStack>
				</Toolbar>
				<div className={s.content}>
					{error && <p className={s.error}>{error}</p>}
					{!reports && !error && (
						<div className={s.loader}>
							<Spinner size={48} placement='centered' />
						</div>
					)}
					{reportsByMonth.map(({ key, count, reports }) => {
						const isOpen = open.includes(key);
						const allInvoiced =
							reports.every((r) => r.invoiceNo) && process.env.NODE_ENV === 'production';
						const members = reportsByMember(reports);
						return (
							<section key={key} className={s.month}>
								<header>
									<div
										className={s.header}
										role='button'
										tabIndex={0}
										onClick={() => toggle(key)}
										onKeyDown={(e: React.KeyboardEvent) => {
											if (e.key === 'Enter' || e.key === ' ') toggle(key);
										}}
									>
										<h2>
											<span className={cn(s.arrow, isOpen && s.open)}>❯</span>
											<span className={s.monthName}>{capitalize(key)} </span>{' '}
											<span className={s.count}>{count} reports</span>{' '}
										</h2>
										<div className={s.meta}>
											<div className={s.metaStatus}>
												{progress[key] && (
													<div className={s.progress}>
														<div className={s.progressTrack}>
															<div
																className={s.progressFill}
																style={{
																	width: `${progress[key]!.total ? (progress[key]!.done / progress[key]!.total) * 100 : 0}%`,
																}}
															/>
														</div>
														<span className={s.progressLabel}>
															{progress[key]!.done}/{progress[key]!.total}
														</span>
													</div>
												)}

												<span className={s.result}>
													{results[key]?.type === 'success' ? results[key].message : <>&nbsp;</>}
												</span>

												{results[key]?.type === 'error' && (
													<>
														<span className={s.error}>
															{results[key]?.type === 'error' ? results[key].message : <>&nbsp;</>}
														</span>
													</>
												)}
											</div>

											<Button
												buttonType='primary'
												buttonSize='m'
												onClick={(e: React.MouseEvent) => {
													e.stopPropagation();
													handleSubmit(key, reports);
												}}
												disabled={submitting === key || allInvoiced}
											>
												{'Submit'}
											</Button>
										</div>
									</div>
								</header>
								{isOpen && (
									<ul className={s.members}>
										{members.map(({ member, reports: memberReports }) => {
											const memberKey = `${key}:${member.id}`;
											const memberOpen = openMembers.includes(memberKey);
											return (
												<li key={member.id}>
													<div
														className={cn(s.member, memberOpen && s.memberOpen)}
														role='button'
														tabIndex={0}
														onClick={() => toggleMember(memberKey)}
														onKeyDown={(e: React.KeyboardEvent) => {
															if (e.key === 'Enter' || e.key === ' ') toggleMember(memberKey);
														}}
													>
														<span className={s.memberName}>
															{member.firstName} {member.lastName}
														</span>
														<span className={s.count}>{memberReports.length} reports</span>
														<span className={cn(s.arrow, memberOpen && s.open)}>❯</span>
													</div>
													{memberOpen && (
														<table className={s.table}>
															<thead>
																<tr>
																	<th>Workshop</th>
																	<th>Equipment</th>
																	<th>Date</th>
																	<th>Time</th>
																	<th>Extra</th>
																	<th>Total</th>
																	<th>Invoice</th>
																</tr>
															</thead>
															<tbody>
																{memberReports.map((report) => (
																	<tr
																		key={report.id}
																		className={report.invoiceNo ? s.invoiced : undefined}
																		data-report-id={report.id}
																		onClick={handleEditReport}
																	>
																		<td>
																			{report.booking?.workshop.title ??
																				report.workshop.title ??
																				''}
																		</td>
																		<td>
																			{report.booking?.equipment.length
																				? report.booking?.equipment
																						.map((e) => e.titleShort || e.title)
																						.join(', ')
																				: ''}
																		</td>
																		<td>{format(new Date(report.date), 'dd MMM').toLowerCase()}</td>
																		<td>
																			{report.hours ? `${report.hours}h` : ''}
																			{report.days ? `${report.days}d` : ''}
																		</td>
																		<td>{report.extraCost ? `${report.extraCost}kr` : ''}</td>
																		<td>{calculateReportCost(report as never)}kr</td>
																		<td>
																			{report.invoiceNo && report.invoiceId && (
																				<a
																					href={`${baseSpirisCustomerInvoiceUrl}${report.invoiceId}`}
																					target='_blank'
																					rel='noreferrer'
																					onClick={(e) => e.stopPropagation()}
																				>
																					#{report.invoiceNo}
																				</a>
																			)}

																			{invoiceStatus[report.member.id] === 'sending' && (
																				<span className={cn(s.status, s.statusSending)}>
																					<span className={s.statusDot} /> Sending
																				</span>
																			)}
																			{invoiceStatus[report.member.id] === 'sent' && (
																				<span className={cn(s.status, s.statusSent)}>✓ Sent</span>
																			)}
																			{invoiceStatus[report.member.id] === 'failed' && (
																				<span className={cn(s.status, s.statusFailed)}>
																					✕ Failed
																				</span>
																			)}
																		</td>
																	</tr>
																))}
															</tbody>
														</table>
													)}
												</li>
											);
										})}
									</ul>
								)}
							</section>
						);
					})}
				</div>
			</div>
		</Canvas>
	);
}
