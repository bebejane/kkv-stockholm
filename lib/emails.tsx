import { sendEmail } from '@/lib/postmark';
import { render } from '@react-email/components';
import TestEmail from '@/emails/test';
import { Booking } from '@/types/schema';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';

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
		label: 'Skapa ditt konto',
		name,
		url,
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

export async function sendResetPasswordEmail({
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

export async function sendBannedUserEmail({ to, name }: { to: string; name: string }): Promise<void> {
	const props = {
		text: 'Ditt konto har blivit inaktiverat. Kontakta oss för att få tillgång till kontot.',
	};

	const subject = 'Inaktiverat konto';
	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject,
		to,
	});
}

export async function sendUnBannedUserEmail({ to, name }: { to: string; name: string }): Promise<void> {
	const props = {
		text: 'Ditt konto har aktiverats igen!',
	};

	const subject = 'Aktiverat konto';
	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject,
		to,
	});
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
	const subject = 'Ny bokning';
	const props = {
		name,
		text: `
			Tack för din bokning!
			Du har bokat ${booking.start} till ${booking.end} i ${booking.workshop}.
		`,
	};

	const html = await render(<TestEmail {...props} />);
	const text = await render(<TestEmail {...props} />, { plainText: true });

	return sendEmail({
		html,
		text,
		subject,
		to,
	});
}
