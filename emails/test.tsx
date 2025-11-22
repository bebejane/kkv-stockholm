import 'dotenv/config';
import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Heading,
	Text,
} from '@react-email/components';

export type TestEmailProps = {
	title?: string;
	label?: string;
	url?: string;
	text?: string;
	name?: string;
};

//const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
const baseUrl = 'https://kkv-stockholm.vercel.app';

export default function TestEmail({ title, url, label, text, name }: TestEmailProps) {
	return (
		<Html>
			<Head />
			<Body className=''>
				<Container className=''>
					<Section className=''>
						<Img width={114} src={`${baseUrl}/images/logo.png`} alt='KKV Logo' className='' />
					</Section>
					<Section className=''>{title && <Heading className=''>title</Heading>}</Section>
					<Section className=''>
						{name && <Text className=''>Hej {name},</Text>}
						{text && <Text className=''>{text}</Text>}
						{url && <Button href={url}>{label ?? 'Klicka här'}</Button>}
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

TestEmail.PreviewProps = {
	url: 'https://kkv-stockholm.vercel.app',
	label: 'Klicka här',
	text: 'Detta är en testmail',
	title: 'Testmail',
	name: 'Name',
};
