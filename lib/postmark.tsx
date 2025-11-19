import { render } from '@react-email/components';
import postmark from 'postmark';
import TestEmail from '@/emails/test';

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN as string);
const defaultOptions = {
	From: process.env.POSTMARK_FROM_EMAIL as string,
	To: process.env.POSTMARK_FROM_NAME as string,
};

export async function sendEmail({
	to,
	subject,
	html,
	text,
}: {
	to: string;
	subject: string;
	html: string;
	text: string;
}) {
	try {
		const res = await client.sendEmail({
			...defaultOptions,
			HtmlBody: html,
			TextBody: text,
			Subject: subject,
			To: to,
		});

		if (res.ErrorCode) throw new Error(res.Message, { cause: res.ErrorCode });
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function sendSignUpEmail({ name, email }: { name: string; email: string }): Promise<void> {
	const props = {
		text: 'Tack för din registrering! vi kommer att behandla din förfrågan inom kort.',
		name,
	};

	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject: 'Tack för din registrering',
		to: email,
	});
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
	const props = {
		url,
		label: 'Klicka här',
		text: 'Verifiera din e-post genom att klicka på länken nedan.',
	};

	const subject = 'Verifiera din e-post';
	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject,
		to,
	});
}

export async function sendPasswordResetEmail({
	to,
	url,
	token,
}: {
	to: string;
	url: string;
	token: string;
}): Promise<void> {
	const props = {
		url,
		label: 'Ändra lösenord',
		text: 'Skapa ett nytt lösenord genom att klicka på länken nedan.',
	};

	const subject = 'Ändra lösenord';
	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject,
		to,
	});
}
