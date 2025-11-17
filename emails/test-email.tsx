import { Button, Html } from '@react-email/components';
import * as React from 'react';

export type TestEmailProps = {
	url: string;
	label: string;
};

export default function TestEmail({ url, label }: TestEmailProps) {
	return (
		<Html>
			<Button href={url} style={{ background: '#000', color: '#fff', padding: '12px 20px' }}>
				{label}
			</Button>
		</Html>
	);
}

TestEmail.PreviewProps = {
	url: 'https://sr.se',
	label: 'Klicka här',
};
