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

	const results: SubmitMonthResult[] = [];

	for (const report of allReports) {
		try {
			const memberId = report.member.id;
			const memberEmail = report.member.email;

			const member = await client.items.find(memberId);
			if (!member) {
				results.push({
					reportId: report.id,
					memberEmail,
					success: false,
					error: 'Member not found in DatoCMS',
				});
				continue;
			}

			const customerId = await findOrCreateCustomer(memberId, memberEmail, member);
			const total = calculateReportCost(report);
			const workshopTitle = report.workshop.title || report.workshop.titleLong || 'Workshop';
			const equipmentNames = ((report as Record<string, any>).booking?.equipment || [])
				.map((e: Record<string, any>) => e.titleShort || e.title || '')
				.filter(Boolean)
				.join(', ');
			const description = equipmentNames ? `${workshopTitle} - ${equipmentNames}` : workshopTitle;

			const invoice = await spirisInvoices.createInvoice({
				CustomerId: customerId,
				InvoiceDate: invoiceDate,
				DueDate: dueDate,
				RotReducedInvoicingType: 0,
				Rows: [
					{
						ArticleId: articleId,
						Text: description,
						Quantity: 1,
						UnitPrice: total,
					},
				],
			});

			await client.items.update(report.id, {
				invoice_id: String(invoice.Id),
				invoice_no: String(invoice.InvoiceNumber),
			});

			results.push({
				reportId: report.id,
				memberEmail,
				success: true,
				invoiceNumber: invoice.InvoiceNumber,
			});
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : 'Unknown error';
			results.push({
				reportId: report.id,
				memberEmail: report.member.email,
				success: false,
				error: errorMessage,
			});
		}
	}

	return results;
}
