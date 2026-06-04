import { client } from '@/lib/client';
import { apiQuery } from 'next-dato-utils/api';
import { AllReportsByRangeDocument } from '@/graphql';
import * as spirisCustomers from '@/lib/spiris/customers';
import * as spirisInvoices from '@/lib/spiris/invoices';
import { PaginatedResponse } from '@/lib/spiris/types';
import { calculateReportCost } from '@/lib/spiris/cost';
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns';

type SubmitMonthResult = {
	reportId: string;
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

type ReportWithMember = {
	id: string;
	member: { id: string; email: string };
	workshop: {
		title?: string | null;
		titleLong?: string | null;
		priceDay: number;
		priceHour: number;
	};
	days: number;
	hours: number;
	extraCost: number;
	booking?: { equipment?: { titleShort?: string | null; title?: string | null }[] } | null;
	assistants?: { days: number; hours: number }[];
};

function buildReportDescription(report: AllReportsByRangeQuery['allReports'][number]): string {
	const workshopTitle =
		report.booking?.workshop?.title ??
		report.workshop.title ??
		(report.workshop.titleLong || 'Workshop');
	const equipmentNames = (report.booking?.equipment ?? [])
		.map((e) => e.titleShort || e.title || '')
		.filter(Boolean)
		.join(', ');
	return equipmentNames ? `${workshopTitle} - ${equipmentNames}` : workshopTitle;
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
	const date = new Date();
	const invoiceDate = format(date, 'yyyy-MM-dd');
	const dueDate = format(addDays(date, 30), 'yyyy-MM-dd');

	const grouped = new Map<string, AllReportsByRangeQuery['allReports']>();
	for (const report of allReports) {
		const memberId = report.member.id;
		if (!grouped.has(memberId)) {
			grouped.set(memberId, []);
		}
		grouped.get(memberId)!.push(report);
	}

	const results: SubmitMonthResult[] = [];

	for (const [memberId, reports] of grouped) {
		try {
			const memberEmail = reports[0].member.email;

			const member = await client.items.find(memberId);
			if (!member) {
				for (const report of reports) {
					results.push({
						reportId: report.id,
						memberEmail,
						success: false,
						error: 'Member not found in DatoCMS',
					});
				}
				continue;
			}

			const customerId = await findOrCreateCustomer(memberId, memberEmail, member);

			const rows: { ArticleId: string; Text: string; Quantity: number; UnitPrice: number }[] = [];
			let grandTotal = 0;

			for (const report of reports) {
				const cost = calculateReportCost(report);
				grandTotal += cost;
				rows.push({
					ArticleId: articleId,
					Text: buildReportDescription(report),
					Quantity: 1,
					UnitPrice: cost,
				});
			}

			const invoice = await spirisInvoices.createInvoice({
				CustomerId: customerId,
				InvoiceDate: invoiceDate,
				DueDate: dueDate,
				RotReducedInvoicingType: 0,
				Rows: rows,
			});

			for (const report of reports) {
				await client.items.update(report.id, {
					invoice_id: String(invoice.Id),
					invoice_no: String(invoice.InvoiceNumber),
				});
			}

			try {
				await spirisInvoices.sendInvoiceByEmail(invoice.Id, memberEmail);
			} catch (e) {
				// email send failure is non-critical
				console.log('Failed to send email to member', memberEmail, e);
			}

			for (const report of reports) {
				results.push({
					reportId: report.id,
					memberEmail,
					success: true,
					invoiceNumber: invoice.InvoiceNumber,
				});
			}
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : 'Unknown error';
			for (const report of reports) {
				results.push({
					reportId: report.id,
					memberEmail: report.member.email,
					success: false,
					error: errorMessage,
				});
			}
		}
	}

	return results;
}
