import 'dotenv/config';
import { sendMemberCreatedNotificartionEmail } from '../lib/controllers/email';
import { client, type Item } from '../lib/client';
import type { Member, Workshop } from '../types/datocms';

const memberTypeId = 'b44GORd_TmaheYg4z180PA';

async function main() {
	const workshops = await client.items.list<Workshop>({
		page: { limit: 2 },
		filter: { type: 'workshop' },
	});
	const workshopIds = workshops.map((w) => w.id);
	console.log(`Using workshops: ${workshops.map((w) => `${w.id} (${w.title_long ?? w.title})`).join(', ')}`);

	const member = {
		id: 'TESTMEMBER01',
		first_name: 'Test',
		last_name: 'Testsson',
		email: 'test@example.com',
		phone: '070-1234567',
		address: 'Testgatan 1',
		postal_code: '123 45',
		city: 'Stockholm',
		ssa: '850101-1234',
		sex: 'woman',
		portfolio: 'https://portfolio.example.com',
		company_name: 'Test AB',
		company_email: 'info@testab.se',
		workshops: workshopIds,
		education: 'Konstfack, 2015\nKKV kurs, 2018',
		artistic_practice: 'Utställningar och gestaltningsuppdrag',
		references: 'Referens 1, Referens 2',
		rules_accepted: true,
		administrator: false,
		compartment: 'Fack A',
		card_number: '1234567890',
		member_status: 'PENDING',
		user: 'usr_test123',
		spiris_customer_id: 'SP-1001',
		yearly_fee: '300',
		contract: { upload_id: 'up_test123', url: 'https://example.com/avtal.pdf' },
		notes: 'En anteckning',
	} as unknown as Item<Member>;

	await sendMemberCreatedNotificartionEmail({
		url: `${process.env.NEXT_PUBLIC_DATOCMS_BASE_EDITING_URL}/editor/item_types/${memberTypeId}/items/${member.id}`,
		member,
	});

	console.log(`✅ Notification email sent to ${process.env.POSTMARK_FROM_EMAIL}`);
}

main().catch((err) => {
	console.error('❌', err instanceof Error ? err.message : err);
	process.exit(1);
});
