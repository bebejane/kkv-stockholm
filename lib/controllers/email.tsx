import { sendEmail } from '@/lib/postmark';
import { render } from '@react-email/components';
import KKVEmail from '@/emails/KKVEmail';
import { Course, Email } from '@/types/datocms';
import { client } from '@/lib/client';
import { Item } from '@/lib/client';
import { BookingType, BookingTypeLinked } from '@/lib/controllers/booking';
import { formatBookingDate, formatDate, formatDateTime } from '@/lib/dates';

export type EmailAction =
	| 'member_created'
	| 'member_accepted'
	| 'member_declined'
	| 'email_verification'
	| 'reset_password'
	| 'banned_user'
	| 'unbanned_user'
	| 'booking_created'
	| 'booking_abortled'
	| 'create_your_account'
	| 'sign_up_to_course';

export async function sendTemplateEmail(
	action: EmailAction,
	to: string,
	props: any = {},
): Promise<void> {
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
		html: await render(<KKVEmail {...p} />),
		text: await render(<KKVEmail {...p} />, { plainText: true }),
		subject,
		to,
	});
}

export async function sendMemberCreatedEmail({
	name,
	email,
}: {
	name: string;
	email: string;
}): Promise<void> {
	return sendTemplateEmail('member_created', email, { name });
}

export async function sendCreateYourAccountEmail({
	name,
	email,
	url,
}: {
	name: string;
	email: string;
	url: string;
}): Promise<void> {
	return sendTemplateEmail('create_your_account', email, { name, url });
}

export async function sendMemberAcceptedEmail({
	name,
	email,
}: {
	name: string;
	email: string;
}): Promise<void> {
	return sendTemplateEmail('member_accepted', email, { name });
}
export async function sendMemberDeclinedEmail({
	name,
	email,
}: {
	name: string;
	email: string;
}): Promise<void> {
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
export async function sendBannedUserEmail({
	to,
	name,
}: {
	to: string;
	name: string;
}): Promise<void> {
	return sendTemplateEmail('banned_user', to, { name });
}
export async function sendUnBannedUserEmail({
	to,
	name,
}: {
	to: string;
	name: string;
}): Promise<void> {
	return sendTemplateEmail('unbanned_user', to, { name });
}
export async function sendBookingCreatedEmail({
	to,
	name,
	booking,
}: {
	to: string;
	name: string;
	booking: BookingTypeLinked;
}): Promise<void> {
	const props = {
		name,
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/medlem/bokningar/${booking.id}`,
		label: 'Gå till din bokning',
		content: `Du har bokat ${formatBookingDate(booking)} i ${booking.workshop?.title_long}.`,
	};
	return sendTemplateEmail('booking_created', to, props);
}

export async function sendBookingAbortledEmail({
	to,
	name,
	booking,
}: {
	to: string;
	name: string;
	booking: BookingType | BookingTypeLinked;
}): Promise<void> {
	const workshop =
		typeof booking.workshop === 'string' ? booking.workshop : booking.workshop?.title;

	const props = {
		name,
		content: `Din bokning den ${formatDateTime(booking.start)} till ${formatDateTime(booking.end)} i ${workshop} har avbrutits.`,
	};
	return sendTemplateEmail('booking_abortled', to, props);
}

export async function sendSignUpToCourseEmail({
	name,
	email,
	course,
}: {
	name: string;
	email: string;
	course: Item<Course>;
}): Promise<void> {
	const props = {
		name,
		content: `Du har anmält dig till kursen ${course.title} på KKV-Stockholm.`,
	};
	return sendTemplateEmail('sign_up_to_course', email, props);
}
