import { spirisFetch } from './client';
import { PaginatedResponse, SpirisArticle, SpirisInvoice, SpirisCustomerInvoiceDraft } from './types';

export async function createInvoiceDraft(
	draft: SpirisCustomerInvoiceDraft,
): Promise<SpirisCustomerInvoiceDraft> {
	return spirisFetch<SpirisCustomerInvoiceDraft>('/customerinvoicedrafts', {
		method: 'POST',
		body: JSON.stringify(draft),
	});
}

export async function convertDraftToInvoice(
	draftId: string,
): Promise<SpirisInvoice> {
	return spirisFetch<SpirisInvoice>(
		`/customerinvoicedrafts/${draftId}/convert`,
		{
			method: 'POST',
			body: JSON.stringify({}),
		},
	);
}

export async function createInvoice(data: {
	CustomerId: string;
	InvoiceDate: string;
	DueDate: string;
	RotReducedInvoicingType: number;
	Rows: {
		ArticleId: string;
		Text: string;
		Quantity: number;
		UnitPrice: number;
	}[];
}): Promise<SpirisInvoice> {
	return spirisFetch<SpirisInvoice>('/customerinvoices', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function findDefaultArticleId(): Promise<string> {
	const response = await spirisFetch<PaginatedResponse<SpirisArticle>>('/articles');

	const match = response.Data.find(
		(a) => a.Name === 'Utfört arbete' || a.NameEnglish === 'Work performed',
	);

	if (match) return match.Id;

	const first = response.Data[0];
	if (first) return first.Id;

	throw new Error('No articles found in Spiris. Create at least one article first.');
}
