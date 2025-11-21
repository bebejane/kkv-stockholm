import 'dotenv/config';
import { client } from '@/lib/client';

const field_prefixes = [
	'member_created',
	'member_accepted',
	'member_declined',
	'email_verification',
	'reset_password',
	'banned_user',
	'unbanned_user',
	'booking_created',
];
const field_suffixes = ['subject', 'text', 'button'];

async function updateEmailModel() {
	const itemTypes = await client.itemTypes.list();
	const emailModel = itemTypes.find((item) => item.api_key === 'email');

	if (!emailModel) {
		throw new Error('Email model not found');
	}

	// const fields = await client.fields.list(emailModel.id);
	// console.log(JSON.stringify(fields, null, 2));
	// return;

	const field_prefixes = [
		'member_created',
		'member_accepted',
		'member_declined',
		'email_verification',
		'reset_password',
		'banned_user',
		'unbanned_user',
		'booking_created',
	];
	const field_suffixes = ['subject', 'text', 'button'];

	for (const prefix of field_prefixes) {
		for (const suffix of field_suffixes) {
			const fieldApiKey = `${prefix}_${suffix}`;
			const fieldType = suffix === 'text' ? 'rich_text' : 'string';

			if (fieldType === 'string') {
				await client.fields.create(emailModel.id, {
					api_key: fieldApiKey,
					label: fieldApiKey.replace(/_/g, ' '),
					field_type: 'string',
					default_value: '',
				});
			} else if (fieldType === 'rich_text') {
				await client.fields.create(emailModel.id, {
					api_key: fieldApiKey,
					label: fieldApiKey.replace(/_/g, ' '),
					field_type: 'rich_text',
					validators: {
						rich_text_blocks: {
							item_types: [],
						},
					},
				});
			}
		}
	}
}

updateEmailModel();
