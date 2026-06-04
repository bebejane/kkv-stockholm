import 'dotenv/config';
import { findDefaultArticleId, createInvoice } from '../lib/spiris/invoices';
import { findArticlesByNames } from '../lib/spiris/articles';
import { spirisFetch } from '../lib/spiris/client';
import { PaginatedResponse, SpirisCustomer, SpirisUnit, SpirisArticle } from '../lib/spiris/types';

async function main() {
	const articleId = await findDefaultArticleId();
	console.log('1. Default article ID:', articleId);

	// 2. Check default article's unit
	const article = await spirisFetch<Record<string, unknown>>(`/articles/${articleId}`);
	const timUnitId = article.UnitId as string;
	console.log(`2. "${article.Name}" unit: ${article.UnitAbbreviation ?? 'none'} (${timUnitId})`);

	// 3. Verify dedicated KKV articles exist
	const kkvArticles = await findArticlesByNames(['KKV tim', 'KKV dag', 'KKV månad']);
	console.log('3. Dedicated KKV articles:');
	for (const name of ['KKV tim', 'KKV dag', 'KKV månad']) {
		const a = kkvArticles.get(name);
		console.log(`   ${name}: ${a ? a.Id : 'NOT FOUND'}`);
	}

	if (kkvArticles.size === 0) {
		console.log('\n⚠️  No dedicated articles found. Create them in Visma:');
		console.log('   - KKV tim  (unit: tim)');
		console.log('   - KKV dag  (unit: dag)');
		console.log('   - KKV månad (unit: Mån)');
		console.log('   Use the existing "Utfört arbete" article as a template.');
		process.exit(0);
	}

	// 4. Create a test invoice with dedicated articles
	const customers = await spirisFetch<PaginatedResponse<SpirisCustomer>>('/customers');
	const customer = customers.Data[0];

	const invoice = await createInvoice({
		CustomerId: customer.Id!,
		InvoiceDate: '2026-06-04',
		DueDate: '2026-07-04',
		RotReducedInvoicingType: 0,
		Rows: [
			{
				ArticleId: kkvArticles.get('KKV dag')!.Id,
				Text: 'Test - 1 dag',
				Quantity: 1,
				UnitPrice: 2000,
			},
			{
				ArticleId: kkvArticles.get('KKV tim')!.Id,
				Text: 'Test - 3 timmar',
				Quantity: 3,
				UnitPrice: 500,
			},
		],
	});
	console.log(`4. ✅ Invoice #${invoice.InvoiceNumber} created`);

	// 5. Verify row units
	const invoiceDetail = await spirisFetch<{ Rows: { Text: string; UnitAbbreviation?: string }[] }>(
		`/customerinvoices/${invoice.Id}`,
	);
	console.log('5. Invoice rows:');
	for (const row of invoiceDetail.Rows) {
		console.log(`   "${row.Text}" → unit: ${row.UnitAbbreviation ?? 'none'}`);
	}

	console.log('\n✅ API fully operational');
}

main().catch((err) => {
	console.error('❌', err instanceof Error ? err.message : err);
	process.exit(1);
});
