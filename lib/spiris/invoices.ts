import { spirisFetch } from './client';
import { SpirisCustomerInvoiceDraft, SpirisInvoice } from './types';

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
