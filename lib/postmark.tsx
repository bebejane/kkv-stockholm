import { render } from '@react-email/components';
import * as postmark from 'postmark';
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

export async function sendMemberCreatedEmail({ name, email }: { name: string; email: string }): Promise<void> {
	const subject = 'Bekräftelse: Medlems ansökan';
	const props = {
		text: 'Tack för din medlems ansökan! Vi kommer att behandla din förfrågan inom kort.',
		name,
	};

	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject,
		to: email,
	});
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
	const subject = 'Skapa ditt konto';
	const props = {
		text: 'Tack för din betalning! Nu kan du skapa ditt konto. Klicka på länken nedan.',
		name,
		url,
		label: 'Skapa ditt konto',
	};

	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject,
		to: email,
	});
}

export async function sendMemberAcceptedEmail({ name, email }: { name: string; email: string }): Promise<void> {
	const subject = `Din ansökan har godkänts!`;
	const props = {
		text: 'För att skapa ditt konto måste du betala kronor. Så här gör du...',
		name,
	};

	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject,
		to: email,
	});
}

export async function sendMemberDeclinedEmail({ name, email }: { name: string; email: string }): Promise<void> {
	const subject = 'Ansökan ej godkänd';
	const props = {
		text: 'Tyvärr kunde vi inte godkänna din ansökan. Vi ber om ursäkt för detta.',
		name,
	};

	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject,
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
