import 'dotenv/config';
import { findDefaultArticleId, createInvoice } from '../lib/spiris/invoices';
import { findCustomerByEmail } from '../lib/spiris/customers';
import { spirisFetch } from '../lib/spiris/client';
import { PaginatedResponse, SpirisCustomer } from '../lib/spiris/types';

async function main() {
	// 1. Check article lookup
	console.log('1. Default article ID:', await findDefaultArticleId());

	// 2. List customers (verify API access)
	const customers = await spirisFetch<PaginatedResponse<SpirisCustomer>>('/customers');
	console.log(`2. Found ${customers.Data.length} customers`);

	// 3. Create a test invoice
	const customer = customers.Data[0];
	const articleId = await findDefaultArticleId();
	const invoice = await createInvoice({
		CustomerId: customer.Id!,
		InvoiceDate: '2026-05-28',
		DueDate: '2026-06-28',
		RotReducedInvoicingType: 0,
		Rows: [{
			ArticleId: articleId,
			Text: 'API Test - Workshop - Equipment',
			Quantity: 1,
			UnitPrice: 500,
		}],
	});
	console.log(`3. ✅ Invoice #${invoice.InvoiceNumber} created`);

	console.log('\n✅ API fully operational');
}

main().catch((err) => {
	console.error('❌', err instanceof Error ? err.message : err);
	process.exit(1);
});
