'use client';

import cn from 'classnames';
import type { RenderPageCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, Spinner, Toolbar, ToolbarTitle, ToolbarStack } from 'datocms-react-ui';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { format, setDefaultOptions } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { capitalize } from 'next-dato-utils/utils';
import s from './InvoicesPage.module.scss';
import { getDatoClientConfig } from '../utils/useDatoClient';
import { datoQuery } from '../utils/dato-query';
import { AllReportsDocument } from '@/graphql';
import type { SubmitMonthResult } from '@/lib/controllers/spiris';
import { groupInvoiceLines } from '@/lib/spiris/cost';

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
	const [openBreakdowns, setOpenBreakdowns] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState<string | null>(null);
	const [reloadingReportId, setReloadingReportId] = useState<string | null>(null);
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

	useEffect(() => {
		const refresh = () => {
			if (document.visibilityState === 'visible') fetchReports();
		};
		window.addEventListener('focus', refresh);
		document.addEventListener('visibilitychange', refresh);
		return () => {
			window.removeEventListener('focus', refresh);
			document.removeEventListener('visibilitychange', refresh);
		};
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

	const toggleBreakdown = (key: string) =>
		setOpenBreakdowns((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
		);

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
			setProgress((prev) => ({ ...prev, [monthLabel]: null }));
			setInvoiceStatus((prev) => {
				const next = { ...prev };
				for (const id of memberIds) delete next[id];
				return next;
			});
		}
	}

	async function openReport(reportId: string) {
		try {
			const record = await ctx.editItem(reportId);
			if (!record) return;
			setReloadingReportId(reportId);
			try {
				await fetchReports();
			} finally {
				setReloadingReportId(null);
			}
		} catch (e) {
			ctx.alert(e instanceof Error ? e.message : 'Kunde inte öppna rapporten');
		}
	}

	async function handleEditReport(e: React.MouseEvent<HTMLTableRowElement>) {
		const reportId = e.currentTarget.dataset.reportId;
		if (reportId) await openReport(reportId);
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
											const breakdownOpen = openBreakdowns.includes(memberKey);
											const breakdown = groupInvoiceLines(memberReports);
											const memberTotal = breakdown.reduce((sum, group) => sum + group.total, 0);
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
															<colgroup>
																<col style={{ width: '19%' }} />
																<col style={{ width: '19%' }} />
																<col style={{ width: '9%' }} />
																<col style={{ width: '9%' }} />
																<col style={{ width: '8%' }} />
																<col style={{ width: '11%' }} />
																<col style={{ width: '15%' }} />
																<col style={{ width: '10%' }} />
															</colgroup>
															<thead>
																<tr>
																	<th>Workshop</th>
																	<th>Equipment</th>
																	<th>Date</th>
																	<th>Hours</th>
																	<th>Days</th>
																	<th>Extra</th>
																	<th>Invoice (spiris)</th>
																	<th>Report</th>
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
																		<td>{report.hours ?? ''}</td>
																		<td>{report.days ?? ''}</td>
																		<td>{report.extraCost ?? ''}</td>
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
																		<td>
																			{reloadingReportId === report.id ? (
																				<Spinner size={16} />
																			) : (
																				<button
																					type='button'
																					className={s.reportLink}
																					onClick={(e) => {
																						e.stopPropagation();
																						openReport(report.id);
																					}}
																				>
																					View
																				</button>
																			)}
																		</td>
																	</tr>
																))}
															</tbody>
															{breakdown.length > 0 && (
																<tbody className={s.breakdownBody}>
																	<tr
																		className={s.breakdownHeadRow}
																		role='button'
																		tabIndex={0}
																		onClick={() => toggleBreakdown(memberKey)}
																		onKeyDown={(e: React.KeyboardEvent) => {
																			if (e.key === 'Enter' || e.key === ' ')
																				toggleBreakdown(memberKey);
																		}}
																	>
																		<td colSpan={breakdownOpen ? 4 : 8}>
																			<span className={cn(s.arrow, breakdownOpen && s.open)}>
																				❯
																			</span>{' '}
																			Invoice breakdown
																		</td>
																		{breakdownOpen && (
																			<>
																				<td>Unit</td>
																				<td>Qty</td>
																				<td>Price</td>
																				<td>Sum</td>
																			</>
																		)}
																	</tr>
																	{breakdownOpen && (
																		<>
																			{breakdown.map((group) => (
																				<Fragment key={group.workshopId}>
																					<tr className={s.breakdownWorkshopRow}>
																						<td colSpan={8}>{group.title}</td>
																					</tr>
																					{[
																						...group.lines,
																						...group.assistants,
																						...group.extra,
																					].map((line, i) => (
																						<tr key={i} className={s.breakdownLineRow}>
																							<td colSpan={4}>{line.text}</td>
																							<td>{line.unit}</td>
																							<td>{line.quantity}</td>
																							<td>{line.unitPrice} kr</td>
																							<td>
																								{(line.quantity * line.unitPrice).toFixed(2)} kr
																							</td>
																						</tr>
																					))}
																					<tr className={s.breakdownSubtotal}>
																						<td colSpan={7} />
																						<td>{group.total.toFixed(2)} kr</td>
																					</tr>
																				</Fragment>
																			))}
																			<tr className={s.breakdownTotal}>
																				<td colSpan={7}>Total</td>
																				<td>{memberTotal.toFixed(2)} kr</td>
																			</tr>
																		</>
																	)}
																</tbody>
															)}
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
