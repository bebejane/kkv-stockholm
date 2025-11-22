import { sendEmail } from '@/lib/postmark';
import { render } from '@react-email/components';
import TestEmail from '@/emails/test';
import { Booking, Email } from '@/types/datocms';
import { client } from '@/lib/client';
import { Item } from '@/lib/client';

export type EmailAction =
	| 'member_created'
	| 'member_accepted'
	| 'member_declined'
	| 'email_verification'
	| 'reset_password'
	| 'banned_user'
	| 'unbanned_user'
	| 'booking_created';

export async function sendTemplateEmail(action: EmailAction, to: string, props: any = {}): Promise<void> {
	if (!action) throw new Error('Email action is required');
	if (!to) throw new Error('Email to is required');

	const email = (
		await client.items.list<Email>({
			page: {
				limit: 1,
			},
			filter: {
				type: 'email',
				fields: {
					action: {
						eq: action,
					},
				},
			},
		})
	)[0];

	if (!email) throw new Error(`Email content not found: ${action}`);
	const { subject, text, button } = email;

	if (!subject) throw new Error(`Email subject missing: ${action}`);

	const p = { subject, text, button, ...props };

	return sendEmail({
		html: await render(<TestEmail {...p} />),
		text: await render(<TestEmail {...p} />, { plainText: true }),
		subject,
		to,
	});
}

export async function sendMemberCreatedEmail({ name, email }: { name: string; email: string }): Promise<void> {
	return sendTemplateEmail('member_created', email, { name });
}
export async function sendCreateAccountEmail({
	name,
	email,
	url,
}: {
	name: string;
	email: string;
	url: string;
}): Promise<void> {
	return sendTemplateEmail('member_created', email, { name, url });
}
export async function sendMemberAcceptedEmail({ name, email }: { name: string; email: string }): Promise<void> {
	return sendTemplateEmail('member_accepted', email, { name });
}
export async function sendMemberDeclinedEmail({ name, email }: { name: string; email: string }): Promise<void> {
	return sendTemplateEmail('member_declined', email, { name });
}
export async function sendEmailVerificationEmail({
	to,
	url,
	token,
}: {
	to: string;
	url: string;
	token: string;
}): Promise<void> {
	return sendTemplateEmail('email_verification', to, { url });
}
export async function sendResetPasswordEmail({
	to,
	url,
	token,
}: {
	to: string;
	url: string;
	token: string;
}): Promise<void> {
	return sendTemplateEmail('reset_password', to, { url, token });
}
export async function sendBannedUserEmail({ to, name }: { to: string; name: string }): Promise<void> {
	return sendTemplateEmail('banned_user', to, { name });
}
export async function sendUnBannedUserEmail({ to, name }: { to: string; name: string }): Promise<void> {
	return sendTemplateEmail('unbanned_user', to, { name });
}
export async function sendBookingCreatedEmail({
	to,
	name,
	booking,
}: {
	to: string;
	name: string;
	booking: Item<Booking>;
}): Promise<void> {
	const props = {
		name,
		content: `Du har bokat ${booking.start} till ${booking.end} i ${booking.workshop}.`,
	};
	return sendTemplateEmail('booking_created', to, props);
}
