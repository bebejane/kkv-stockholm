import { render } from '@react-email/components';
import postmark from 'postmark';
import TestEmail from '@/emails/test-email';

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY as string);

const emailHtml = await render(<TestEmail url='https://example.com' />);

const options = {
	From: process.env.POSTMARK_FROM as string,
	To: process.env.POSTMARK_FROM as string,
	Subject: 'TestEmail',
	HtmlBody: emailHtml,
};

await client.sendEmail(options);
