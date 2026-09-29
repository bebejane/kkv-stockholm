import * as postmark from 'postmark';

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN as string);

// `To` is set per send (see `sendEmail`); a default recipient here was a bug.
const defaultOptions = {
	From: process.env.POSTMARK_FROM_EMAIL as string,
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
