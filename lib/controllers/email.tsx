import { sendEmail } from '@/lib/postmark';
import { render } from '@react-email/components';
import KKVEmail from '@/emails/KKVEmail';
import { Course, Email } from '@/types/datocms';
import { client } from '@/lib/client';
import { Item } from '@/lib/client';
import { BookingType, BookingTypeLinked } from '@/lib/controllers/booking';
import { formatBookingDate, formatDate, formatDateTime, formatDateTimeRange } from '@/lib/dates';
import { BadRequestError, NotFoundError } from '@/lib/errors';
import { ErrorMessages } from '@/lib/error-messages';

const STRIPE_PAYMENT_URL =
	'https://buy.stripe.com/eVa15paC9aMR9CEcMM?locale=sv&__embed_source=buy_btn_1NadVgIwPZe2sgbbTGCyOXMt';

export type EmailAction =
	| 'member_created'
	| 'member_created_notification'
	| 'member_accepted'
	| 'member_declined'
	| 'email_verification'
	| 'reset_password'
	| 'banned_user'
	| 'unbanned_user'
	| 'booking_created'
	| 'booking_aborted'
	| 'create_your_account'
	| 'sign_up_to_course';

export async function sendTemplateEmail(
	action: EmailAction,
	to: string,
	props: Record<string, unknown> = {},
): Promise<void> {
	if (!action) throw new BadRequestError(ErrorMessages.EMAIL_ACTION_REQUIRED);
	if (!to) throw new BadRequestError(ErrorMessages.EMAIL_TO_REQUIRED);

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

	if (!email) throw new NotFoundError('Email', ErrorMessages.EMAIL_CONTENT_NOT_FOUND(action));
	const { subject, text, button } = email;

	if (!subject)
		throw new NotFoundError('Email subject', ErrorMessages.EMAIL_SUBJECT_MISSING(action));

	const p = { text: text ?? undefined, button: button ?? undefined, ...props };

	const element = <KKVEmail {...p} />;
	return sendEmail({
		html: await render(element),
		text: await render(element, { plainText: true }),
		subject,
		to,
	});
}

/**
 * Runs an email send without letting failures bubble up. Use it after a write
 * has already been committed (or inside a webhook handler) so a mail outage can
 * never turn a successful operation into a 500 or trigger a DatoCMS webhook
 * retry. Failures are logged for monitoring instead.
 */
export async function safeSendEmail(send: () => Promise<void>): Promise<void> {
	try {
		await send();
	} catch (e) {
		console.error('[email] send failed', e);
	}
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

export async function sendMemberCreatedNotificartionEmail({ url }: { url: string }): Promise<void> {
	return sendTemplateEmail('member_created_notification', process.env.POSTMARK_FROM_EMAIL!, {
		url,
	});
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
	return sendTemplateEmail('member_accepted', email, { name, url: STRIPE_PAYMENT_URL });
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

export async function sendBookingAbortedEmail({
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
	return sendTemplateEmail('booking_aborted', to, props);
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
		content: `Du har anmält dig till kursen ${course.title} på KKV-Stockholm. Kursen startar ${formatDateTime(course.start)}.`,
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/kurser/${course.slug}`,
		button: 'Gå till kursen',
	};
	return sendTemplateEmail('sign_up_to_course', email, props);
}
