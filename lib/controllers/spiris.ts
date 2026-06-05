import { client } from '@/lib/client';
import { apiQuery } from 'next-dato-utils/api';
import { AllReportsByRangeDocument } from '@/graphql';
import * as spirisCustomers from '@/lib/spiris/customers';
import * as spirisInvoices from '@/lib/spiris/invoices';
import { PaginatedResponse } from '@/lib/spiris/types';
import { findArticlesByNames } from '@/lib/spiris/articles';
import { buildInvoiceRows } from '@/lib/spiris/cost';
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns';

type SubmitMonthResult = {
	memberEmail: string;
	success: boolean;
	invoiceNumber?: number;
	error?: string;
};

type TermsOfPayment = {
	Id: string;
	AvailableForSales: boolean;
	Name?: string;
};

async function fetchTermsOfPaymentId(): Promise<string> {
	const { spirisFetch } = await import('@/lib/spiris/client');
	const response = await spirisFetch<PaginatedResponse<TermsOfPayment>>('/termsofpayments');

	const salesTerms = response.Data.find((t) => t.AvailableForSales);
	if (!salesTerms) {
		throw new Error('No terms of payment available for sales found in Spiris');
	}
	return salesTerms.Id;
}

async function findOrCreateCustomer(
	memberId: string,
	memberEmail: string,
	member: Record<string, unknown>,
): Promise<string> {
	const spirisCustomerId = member.spiris_customer_id as string | undefined;

	if (spirisCustomerId) {
		try {
			await spirisCustomers.findCustomerById(spirisCustomerId);
			return spirisCustomerId;
		} catch {
			const found = await spirisCustomers.findCustomerByEmail(memberEmail);
			if (found && found.Id) {
				await client.items.update(memberId, { spiris_customer_id: found.Id });
				return found.Id;
			}
		}
	}

	const existing = await spirisCustomers.findCustomerByEmail(memberEmail);
	if (existing && existing.Id) {
		await client.items.update(memberId, { spiris_customer_id: existing.Id });
		return existing.Id;
	}

	const termsOfPaymentId = await fetchTermsOfPaymentId();

	const name = `${member.first_name || ''} ${member.last_name || ''}`.trim();
	const address = (member.address as string) || '';
	const postalCode = (member.postal_code as string) || '';
	const city = (member.city as string) || '';
	const phone = (member.phone as string) || '';

	const newCustomer = await spirisCustomers.createCustomer({
		Name: name || memberEmail,
		EmailAddress: memberEmail,
		MobilePhone: phone || null,
		InvoiceAddress1: address || null,
		InvoicePostalCode: postalCode,
		InvoiceCity: city,
		InvoiceCountryCode: 'SE',
		IsActive: true,
		IsPrivatePerson: true,
		TermsOfPaymentId: termsOfPaymentId,
	});

	await client.items.update(memberId, { spiris_customer_id: newCustomer.Id });

	return newCustomer.Id!;
}

export async function ensureSpirisCustomer(
	memberId: string,
): Promise<{ updated: boolean; customerId?: string }> {
	const member = await client.items.find(memberId);

	if (!member) {
		return { updated: false };
	}

	const spirisCustomerId = member.spiris_customer_id as string | undefined;

	if (!spirisCustomerId) {
		return { updated: false };
	}

	const email = member.email as string;
	const name = `${member.first_name || ''} ${member.last_name || ''}`.trim();

	await spirisCustomers.updateCustomer(spirisCustomerId, {
		Name: name || email,
		EmailAddress: email,
		MobilePhone: (member.phone as string) || null,
		InvoiceAddress1: (member.address as string) || null,
		InvoicePostalCode: (member.postal_code as string) || '',
		InvoiceCity: (member.city as string) || '',
	});

	return { updated: true, customerId: spirisCustomerId };
}

function buildReportDescription(report: AllReportsByRangeQuery['allReports'][number]): string {
	const workshopTitle =
		report.booking?.workshop?.title ??
		report.workshop.title ??
		(report.workshop.titleLong || 'Workshop');
	const equipmentNames = (report.booking?.equipment ?? [])
		.map((e) => e.titleShort || e.title || '')
		.filter(Boolean)
		.join(', ');
	const date = format(report.date, 'dd MMM').toLowerCase();
	return `${equipmentNames ? `${workshopTitle} - (${equipmentNames})` : workshopTitle} - ${date}`;
}

export async function submitMonth(month: number, year: number): Promise<SubmitMonthResult[]> {
	const start = startOfMonth(new Date(year, month));
	const end = endOfMonth(new Date(year, month));

	const { allReports } = await apiQuery(AllReportsByRangeDocument, {
		variables: {
			start: start.toISOString(),
			end: end.toISOString(),
		},
	});

	if (!allReports || allReports.length === 0) {
		return [];
	}

	const articleId = await spirisInvoices.findDefaultArticleId();

	const articleMap = await findArticlesByNames(['KKV tim', 'KKV dag', 'KKV månad', 'KKV stycke']);
	const unitArticles: Record<string, string> = {};
	if (articleMap.has('KKV tim')) unitArticles['tim'] = articleMap.get('KKV tim')!.Id;
	if (articleMap.has('KKV dag')) unitArticles['dag'] = articleMap.get('KKV dag')!.Id;
	if (articleMap.has('KKV månad')) unitArticles['mån'] = articleMap.get('KKV månad')!.Id;
	if (articleMap.has('KKV stycke')) unitArticles['st'] = articleMap.get('KKV stycke')!.Id;

	const date = new Date();
	const invoiceDate = format(date, 'yyyy-MM-dd');
	const dueDate = format(addDays(date, 30), 'yyyy-MM-dd');

	const grouped = new Map<string, AllReportsByRangeQuery['allReports']>();
	for (const report of allReports) {
		if (report.invoiceNo) continue;
		const memberId = report.member.id;
		if (!grouped.has(memberId)) {
			grouped.set(memberId, []);
		}
		grouped.get(memberId)!.push(report);
	}

	const results: SubmitMonthResult[] = [];

	// Pre-fetch all member data from DatoCMS in parallel
	const memberIds = Array.from(grouped.keys());
	const memberFetches = await Promise.allSettled(
		memberIds.map((id) => client.items.find(id).then((m) => ({ id, member: m } as const))),
	);
	const memberCache = new Map<string, Record<string, unknown> | null>();
	for (let i = 0; i < memberFetches.length; i++) {
		const fetch = memberFetches[i];
		if (fetch.status === 'fulfilled') {
			memberCache.set(fetch.value.id, fetch.value.member as Record<string, unknown>);
		} else {
			memberCache.set(memberIds[i], null);
		}
	}

	const entries = Array.from(grouped.entries());
	const BATCH_SIZE = 5;

	for (let i = 0; i < entries.length; i += BATCH_SIZE) {
		const batch = entries.slice(i, i + BATCH_SIZE);

		const batchResults = await Promise.allSettled(
			batch.map(async ([memberId, reports]) => {
				const memberEmail = reports[0].member.email;
				const member = memberCache.get(memberId);

				if (!member) {
					return {
						memberEmail,
						success: false,
						error: 'Member not found in DatoCMS',
					} satisfies SubmitMonthResult;
				}

				const customerId = await findOrCreateCustomer(memberId, memberEmail, member);

				const rows: { ArticleId: string; Text: string; Quantity: number; UnitPrice: number }[] = [];

				for (const report of reports) {
					rows.push(...buildInvoiceRows(report, articleId, buildReportDescription(report), unitArticles));
				}

				const invoice = await spirisInvoices.createInvoice({
					CustomerId: customerId,
					InvoiceDate: invoiceDate,
					DueDate: dueDate,
					RotReducedInvoicingType: 0,
					Rows: rows,
				});

				await Promise.all(
					reports.map((report) =>
						client.items.update(report.id, {
							invoice_id: String(invoice.Id),
							invoice_no: String(invoice.InvoiceNumber),
						}),
					),
				);

				try {
					await spirisInvoices.sendInvoiceByEmail(invoice.Id, memberEmail);
				} catch (e) {
					console.log('Failed to send email to member', memberEmail, e);
				}

				return {
					memberEmail,
					success: true,
					invoiceNumber: invoice.InvoiceNumber,
				} satisfies SubmitMonthResult;
			}),
		);

		for (const result of batchResults) {
			if (result.status === 'fulfilled') {
				results.push(result.value);
			} else {
				results.push({
					memberEmail: 'unknown',
					success: false,
					error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
				});
			}
		}
	}

	return results;
}
